import transition, { Action, Status } from "./state-machine";

import * as PropTypes from "prop-types";
import * as React from "react";
import invariant from "invariant";
import makeCancelable, { CancelablePromise } from "./make-cancelable";

export { Status as EditableState };
export const EditableStateType = PropTypes.oneOf(Object.keys(Status));

export type EditablePropsWithoutChildren<TCommitType, TValue> = {
  onCancel?: (value: TValue) => void;
  onCommit?: (message: TCommitType, value: TValue) => any;
  value: TValue;
};

export type TInnerProps<TCommitType, TValue> = {
  onCancel: (value: TValue) => void;
  onChange: (value: TValue) => void;
  onCommit?: (message: TCommitType, value: TValue) => Promise<any>;
  onStart: () => void;
  status: Status;
  value: TValue;
};

type EditableChild<TCommitType, TValue> = (
  props: TInnerProps<TCommitType, TValue>
) => React.ReactNode;

export type EditableProps<
  TCommitType extends string,
  TValue
> = EditablePropsWithoutChildren<TCommitType, TValue> & {
  children?: EditableChild<TCommitType, TValue>;
};

type EditableState<TValue> = {
  status: Status;
  value?: TValue;
};

function getValue<TCommitType extends string, TValue>(
  props: EditableProps<TCommitType, TValue>,
  state: EditableState<TValue>
): TValue {
  return state.status === Status.PRESENTING
    ? props.value
    : (state.value as TValue);
}

export default class Editable<
  TCommitType extends string,
  TValue
> extends React.Component<
  EditableProps<TCommitType, TValue>,
  EditableState<TValue>
> {
  static displayName = "editable";

  static propTypes = {
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    onUpdate: PropTypes.func,
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
    this.setState((state, props) =>
      transition(state.status, Action.COMMIT, getValue(props, state))
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
      this.setState(
        state => transition(state.status, Action.SUCCESS),
        () => {
          resolve();
        }
      );
    });
  };

  render() {
    const { status } = this.state;
    const children = this.props.children as EditableChild<TCommitType, TValue>;

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
