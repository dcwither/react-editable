import makeCancelable, { CancelablePromise } from "./make-cancelable";
import transition, { Action, Status } from "./state-machine";
import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import invariant from "invariant";

export { Status as EditableStatus };
export const EditableStatusType = PropTypes.oneOf(Object.keys(Status));

export interface EditableArgs<TValue, TCommitType> {
  onCancel?: (value: TValue) => void;
  onCommit?: (message: TCommitType, value: TValue) => any;
  value: TValue;
}

export interface EditableResponse<TValue, TCommitType> {
  onCancel: () => void;
  onChange: (value: TValue) => void;
  onCommit: (message: TCommitType) => Promise<any>;
  onStart: () => void;
  status: Status;
  value: TValue;
}

export interface EditableState<TValue> {
  status: Status;
  value?: TValue;
}

function getValue<TValue>(
  inputValue: TValue,
  state: EditableState<TValue>
): TValue {
  return state.status === Status.PRESENTING
    ? inputValue
    : (state.value as TValue);
}

export default function useEditable<TValue, TCommitType = string>({
  value: inputValue,
  onCancel,
  onCommit
}: EditableArgs<TValue, TCommitType>): EditableResponse<TValue, TCommitType> {
  const [state, setState] = useState<EditableState<TValue>>({
    status: Status.PRESENTING,
    value: undefined
  });

  const commitPromise = useRef<CancelablePromise<any> | undefined>();

  useEffect(() => {
    return () => {
      if (commitPromise.current) {
        commitPromise.current.cancel();
      }
    };
  }, [commitPromise]);

  const handleStart = () => {
    setState(prevState =>
      transition(prevState.status, Action.START, inputValue)
    );
  };

  const handleChange = (nextValue: TValue) => {
    setState(prevState =>
      transition(prevState.status, Action.CHANGE, nextValue)
    );
  };

  const handleCancel = () => {
    const { status, value } = state;

    if (typeof onCancel === "function" && status === Status.EDITING) {
      onCancel(value as TValue);
    }

    setState(prevState => transition(prevState.status, Action.CANCEL));
  };

  const handleCommit = (message: TCommitType): Promise<any> => {
    invariant(
      state.status !== Status.COMMITTING,
      "React Editable cannot commit while commiting"
    );

    setState(prevState =>
      transition(
        prevState.status,
        Action.COMMIT,
        getValue(inputValue, prevState)
      )
    );

    if (typeof onCommit === "function") {
      // TODO: find a way to test this async behavior (enzyme makes setState synchronous)
      // May have just started and not yet updated state
      const maybeCommitPromise = onCommit(message, getValue(inputValue, state));

      if (maybeCommitPromise && maybeCommitPromise.then) {
        commitPromise.current = makeCancelable(maybeCommitPromise);
        return commitPromise.current
          .then(() => {
            setState(prevState =>
              transition(
                prevState.status,
                Action.SUCCESS,
                getValue(inputValue, prevState)
              )
            );
          })
          .catch(response => {
            if (!response || !response.isCanceled) {
              setState(prevState =>
                transition(
                  prevState.status,
                  Action.FAIL,
                  getValue(inputValue, prevState)
                )
              );
            }
          })
          .then(() => (commitPromise.current = undefined));
      }
    }

    setState(prevState => transition(prevState.status, Action.SUCCESS));

    // does this happen synchronously enough, or do we need a useEffect?
    return Promise.resolve();
  };

  return {
    onCancel: handleCancel,
    onChange: handleChange,
    onCommit: handleCommit,
    onStart: handleStart,
    status: state.status,
    value: getValue(inputValue, state)
  };
}
