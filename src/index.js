import transition, {actions, states} from './state-machine';

import PropTypes from 'prop-types';
import React from 'react';
import omit from './omit';

export default function withCrud(WrappedComponent) {
  return class ComponentWithCrud extends React.Component {
    static propTypes = {
      onDelete: PropTypes.func,
      onSubmit: PropTypes.func,
      onUpdate: PropTypes.func,
      value: PropTypes.any,
      ...omit(WrappedComponent.propTypes, ['onStart', 'onChange', 'onCancel', 'status'])
    };

    state = {
      status: states.PRESENTING,
      value: undefined
    };

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
          return maybeCommitPromise
            .then(() => this.setState((state) => transition(state.status, actions.SUCCESS)))
            .catch(() => this.setState((state) => transition(state.status, actions.FAIL, state.value)));
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
      return this.handleCommit(this.props.onDelete);
    }

    render() {
      const {
        props: {value: propsValue, onSubmit, onUpdate, onDelete},
        state: {value: stateValue, status}
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
