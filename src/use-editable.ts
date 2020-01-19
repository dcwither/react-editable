import transition, { Action, Status } from "./state-machine";

import invariant from "invariant";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from 'react'
import makeCancelable, { CancelablePromise } from "./make-cancelable";

export { Status as EditableStatus };
export const EditableStatusType = PropTypes.oneOf(Object.keys(Status));

export interface EditableArgs<TValue, TCommitType> {
  onCancel?: (value: TValue) => void;
  onCommit?: (message: TCommitType, value: TValue) => any;
  value: TValue;
}

export interface EditableResponse<TValue, TCommitType> {
  onCancel: (value: TValue) => void;
  onChange: (value: TValue) => void;
  onCommit: (message: TCommitType, value: TValue) => Promise<any>;
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

export default function useEditable<TValue, TCommitType = string>({ value: inputValue, onCancel, onCommit }: EditableArgs<TValue, TCommitType>): EditableResponse<TValue, TCommitType> {
  const [state, setState] = useState<EditableState<TValue>>({ status: Status.PRESENTING, value: undefined });

  const commitPromise = useRef<CancelablePromise<any> | undefined>();

  useEffect(
    () => {
      if (commitPromise.current) {
        commitPromise.current.cancel()
      }

    }, [commitPromise]
  );

  const handleStart = () => {
    setState(transition(state.status, Action.START, inputValue)
    );
  };

  const handleChange = (nextValue: TValue) => {
    setState(transition(state.status, Action.CHANGE, nextValue));
  };

  const handleCancel = () => {
    const { status, value } = state;

    if (typeof onCancel === "function" && status === Status.EDITING) {
      onCancel(value as TValue);
    }

    setState(transition(state.status, Action.CANCEL));
  };

  const handleCommit = (message: TCommitType): Promise<any> => {
    invariant(
      state.status !== Status.COMMITTING,
      "React Editable cannot commit while commiting"
    );
    setState(transition(
      state.status, Action.COMMIT, getValue(inputValue, state)
    ));

    if (typeof onCommit === "function") {
      // TODO: find a way to test this async behavior (enzyme makes setState synchronous)
      // May have just started and not yet updated state
      const maybeCommitPromise = onCommit(
        message,
        getValue(inputValue, state)
      );

      if (maybeCommitPromise && maybeCommitPromise.then) {
        commitPromise.current = makeCancelable(maybeCommitPromise);
        return commitPromise.current
          .then(() =>
            setState(transition(state.status, Action.SUCCESS))
          )
          .catch(response => {
            if (!response || !response.isCanceled) {
              setState(transition(state.status, Action.FAIL));
            }
          })
          .then(() => (commitPromise.current = undefined));
      }
    }


    setState(transition(state.status, Action.SUCCESS));

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
