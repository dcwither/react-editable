import transition, {actions, states} from './state-machine';

import PropTypes from 'prop-types';
import React from 'react';
import makeCancelable from './make-cancelable';
import omit from './omit';

export default function withEditable(WrappedComponent) {
  return class ComponentWithEditable extends React.Component {
    static propTypes = {
      onDelete: PropTypes.func,
      onSubmit: PropTypes.func,
      onUpdate: PropTypes.func,
      value: PropTypes.any,
      ...omit(WrappedComponent.propTypes, ['onStart', 'onChange', 'onCancel', 'status']),
    };

    state = {
      status: states.PRESENTING,
      value: undefined,
    };

    commitPromise = null;

    componentWillUnmount() {
      this.commitPromise && this.commitPromise.cancel();
    }

    handleStart = () => {
      this.setState((state) => transition(state.status, actions.START, this.props.value));
    }

    handleChange = (nextValue) => {
      this.setState((state) => transition(state.status, actions.CHANGE, nextValue));
    }

    handleCancel = () => {
      this.setState((state) => transition(state.status, actions.CANCEL));
    }

    handleCommit = (commitFunc) => {
      this.setState((state) => transition(state.status, actions.COMMIT));

      if (typeof commitFunc === 'function') {
        const maybeCommitPromise = commitFunc(this.state.value);
        if (maybeCommitPromise && maybeCommitPromise.then) {
          this.commitPromise = makeCancelable(maybeCommitPromise);
          return this.commitPromise
            .promise
            .then(() => this.setState((state) => transition(state.status, actions.SUCCESS)))
            .catch((response) => {
              if (!response || !response.isCanceled) {
                this.setState((state) => transition(state.status, actions.FAIL));
              }
            })
            .then(() => this.commitPromise = null);

        } else {
          this.setState((state) => transition(state.status, actions.SUCCESS));
        }
      }
    }

    handleSubmit = () => {
      return this.handleCommit(this.props.onSubmit);
    }

    handleUpdate = () => {
      return this.handleCommit(this.props.onUpdate);
    }

    handleDelete = () => {
      this.handleStart(); // Delete while status === PRESENTING
      return this.handleCommit(this.props.onDelete);
    }

    render() {
      const {
        props: {value: propsValue, onSubmit, onUpdate, onDelete},
        state: {value: stateValue, status},
      } = this;

      return (
        <WrappedComponent
          {...omit(this.props, ['value'])}
          status={status}
          value={status === states.PRESENTING ? propsValue : stateValue}
          onStart={this.handleStart}
          onCancel={this.handleCancel}
          onChange={this.handleChange}
          onSubmit={onSubmit ? this.handleSubmit : undefined}
          onUpdate={onUpdate ? this.handleUpdate : undefined}
          onDelete={onDelete ? this.handleDelete : undefined}
        />
      );
    }
  };
}
