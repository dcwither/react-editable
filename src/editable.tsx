import transition, { Action, Status } from "./state-machine";

import PropTypes from "prop-types";
import React from "react";
import invariant from "invariant";
import makeCancelable, { CancelablePromise } from "./make-cancelable";

export { Status as EditableStatus };
export const EditableStateType = PropTypes.oneOf(Object.keys(Status));

export type EditablePropsWithoutChildren<TValue, TCommitType> = {
  onCancel?: (value: TValue) => void;
  onCommit?: (message: TCommitType, value: TValue) => any;
  value: TValue;
};

export type TInnerProps<TValue, TCommitType> = {
  onCancel: (value: TValue) => void;
  onChange: (value: TValue) => void;
  onCommit: (message: TCommitType, value: TValue) => Promise<any>;
  onStart: () => void;
  status: Status;
  value: TValue;
};

export type EditableChild<TValue, TCommitType> = (
  props: TInnerProps<TValue, TCommitType>
) => React.ReactNode;

export type EditableProps<TValue, TCommitType> = EditablePropsWithoutChildren<
  TValue,
  TCommitType
> & {
  children?: EditableChild<TValue, TCommitType>;
};

export type EditableState<TValue> = {
  status: Status;
  value?: TValue;
};

function getValue<TValue, TCommitType>(
  props: EditableProps<TValue, TCommitType>,
  state: EditableState<TValue>
): TValue {
  return state.status === Status.PRESENTING
    ? props.value
    : (state.value as TValue);
}

export default class Editable<
  TValue,
  TCommitType = string
> extends React.Component<
  EditableProps<TValue, TCommitType>,
  EditableState<TValue>
> {
  static displayName = "Editable";

  static propTypes = {
    onCommit: PropTypes.func,
    value: PropTypes.any,
    children: PropTypes.func
  };

  static defaultProps = {
    children: () => null
  };

  state: EditableState<TValue> = {
    status: Status.PRESENTING,
    value: undefined
  };

  commitPromise: CancelablePromise<any> | undefined;

  componentWillUnmount() {
    this.commitPromise && this.commitPromise.cancel();
  }

  handleStart = () => {
    this.setState(state =>
      transition(state.status, Action.START, this.props.value)
    );
  };

  handleChange = (nextValue: TValue) => {
    this.setState(state => transition(state.status, Action.CHANGE, nextValue));
  };

  handleCancel = () => {
    const {
      props: { onCancel },
      state: { status, value }
    } = this;

    if (typeof onCancel === "function" && status === Status.EDITING) {
      onCancel(value as TValue);
    }

    this.setState(state => transition(state.status, Action.CANCEL));
  };

  handleCommit = (message: TCommitType): Promise<any> => {
    const { onCommit } = this.props;
    invariant(
      this.state.status !== Status.COMMITTING,
      "React Editable cannot commit while commiting"
    );
    this.setState(state =>
      transition(state.status, Action.COMMIT, getValue(this.props, this.state))
    );

    if (typeof onCommit === "function") {
      // TODO: find a way to test this async behavior (enzyme makes setState synchronous)
      // May have just started and not yet updated state
      const maybeCommitPromise = onCommit(
        message,
        getValue(this.props, this.state)
      );

      if (maybeCommitPromise && maybeCommitPromise.then) {
        this.commitPromise = makeCancelable(maybeCommitPromise);
        return this.commitPromise
          .then(() =>
            this.setState(state => transition(state.status, Action.SUCCESS))
          )
          .catch(response => {
            if (!response || !response.isCanceled) {
              this.setState(state => transition(state.status, Action.FAIL));
            }
          })
          .then(() => (this.commitPromise = undefined));
      }
    }

    return new Promise(resolve => {
      this.setState(state => transition(state.status, Action.SUCCESS), resolve);
    });
  };

  render() {
    const { status } = this.state;
    const children = this.props.children as EditableChild<TValue, TCommitType>;

    return children({
      onCancel: this.handleCancel,
      onChange: this.handleChange,
      onStart: this.handleStart,
      onCommit: this.handleCommit,
      status,
      value: getValue(this.props, this.state)
    });
  }
}
