import transition, { actions, states } from "./state-machine";

import * as PropTypes from "prop-types";
import * as React from "react";
import invariant from "invariant";
import makeCancelable, { CancelablePromise } from "./make-cancelable";

function getValue(props, state) {
  return state.status === states.PRESENTING ? props.value : state.value;
}

export { states as EditableState };
export const EditableStateType = PropTypes.oneOf(Object.keys(states));

type EditablePropsWithoutChildren<TValue> = {
  onCancel: (value: TValue | undefined) => void;
  onDelete: (value: TValue | undefined) => Promise<any> | undefined;
  onSubmit: (value: TValue | undefined) => Promise<any> | undefined;
  onUpdate: (value: TValue | undefined) => Promise<any> | undefined;
  value?: TValue;
};

type EditableChild<TValue> = (
  props: Partial<
    EditablePropsWithoutChildren<TValue> & {
      onChange: (value) => void;
      onStart: () => void;
      status: string;
    }
  >
) => JSX.Element;

type EditableProps<TValue> = Partial<EditablePropsWithoutChildren<TValue>> & {
  children?: EditableChild<TValue>;
};

type EditableState<TValue> = {
  status: string;
  value?: TValue;
};

export default class Editable<TValue> extends React.Component<
  EditableProps<TValue>,
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

  state = {
    status: states.PRESENTING,
    value: undefined
  };

  commitPromise: CancelablePromise<any> | undefined;

  componentWillUnmount() {
    this.commitPromise && this.commitPromise.cancel();
  }

  handleStart = () => {
    this.setState(state =>
      transition(state.status, actions.START, this.props.value)
    );
  };

  handleChange = nextValue => {
    this.setState(state => transition(state.status, actions.CHANGE, nextValue));
  };

  handleCancel = () => {
    const {
      props: { onCancel },
      state: { status, value }
    } = this;

    if (typeof onCancel === "function" && status === states.EDITING) {
      onCancel(value);
    }

    this.setState(state => transition(state.status, actions.CANCEL));
  };

  handleCommit = commitFunc => {
    invariant(
      this.state.status !== states.COMMITTING,
      "React Editable cannot commit while commiting"
    );
    this.setState((state, props) =>
      transition(state.status, actions.COMMIT, getValue(props, state))
    );

    if (typeof commitFunc === "function") {
      // TODO: find a way to test this async behavior (enzyme makes setState synchronous)
      // May have just started and not yet updated state
      const maybeCommitPromise = commitFunc(getValue(this.props, this.state));

      if (maybeCommitPromise && maybeCommitPromise.then) {
        this.commitPromise = makeCancelable(maybeCommitPromise);
        return this.commitPromise
          .then(() =>
            this.setState(state => transition(state.status, actions.SUCCESS))
          )
          .catch(response => {
            if (!response || !response.isCanceled) {
              this.setState(state => transition(state.status, actions.FAIL));
            }
          })
          .then(() => (this.commitPromise = undefined));
      }
    }
    this.setState(state => transition(state.status, actions.SUCCESS));
  };

  handleSubmit = () => {
    return this.handleCommit(this.props.onSubmit);
  };

  handleUpdate = () => {
    return this.handleCommit(this.props.onUpdate);
  };

  handleDelete = () => {
    return this.handleCommit(this.props.onDelete);
  };

  render() {
    const { status } = this.state;
    const children = this.props.children as EditableChild<TValue>;

    return children({
      onCancel: this.handleCancel,
      onChange: this.handleChange,
      onDelete: this.handleDelete,
      onStart: this.handleStart,
      onSubmit: this.handleSubmit,
      onUpdate: this.handleUpdate,
      status,
      value: getValue(this.props, this.state)
    });
  }
}
