import transition, {actions, states} from './state-machine';

import PropTypes from 'prop-types';
import React from 'react';

function getNextState(state, action, nextValue) {
  const {value, status} = state;
  const nextStatus = transition(status, action);
  switch (nextStatus) {
    case [actions.PRESENTING]:
      return {
        status: nextStatus
      };

    case [actions.EDITING]:
      return {
        status: nextStatus,
        value: nextValue
      };

    case [actions.COMMITING]:
      return {
        status: nextStatus,
        value
      };

    default:
      return state;
  }
}

function withCrud(WrappedComponent) {
  return class ComponentWithCrud extends React.CreateComponent {
    static propTypes = {
      onDelete: PropTypes.func,
      onSubmit: PropTypes.func,
      onUpdate: PropTypes.func,
      value: PropTypes.any,
      ..._.omit(WrappedComponent.propTypes, ['onStart', 'onChange', 'onCancel', 'status']),
    };

    static defaultProps = {
      valueComparitor: (a, b) => a === b
    };

    constructor(props) {
      super(props);
      this.state = {
        status: states.PRESENTING
      };
    }

    handleStart = () => {
      this.handleChange(this.props.value);
    }

    handleChange = (nextValue) => {
      this.replaceState((state) => getNextState(state, actions.CHANGE, nextValue));
    }

    handleCancel = () => {
      this.replaceState((state) => getNextState(state, actions.CANCEL))
    }

    handleCommit = (commitFunc) => {
      if (typeof commitFunc === 'function') {
        const maybeCommitPromise = commitFunc(this.state.value);
        if (maybeCommitPromise && maybeCommitPromise.then) {
          maybeCommitPromise
            .then(() => this.replaceState((state) => getNextState(state, actions.SUCCESS)))
            .catch(() => this.replaceState((state) => getNextState(state, actions.FAIL)))
        } else {
          this.replaceState((state) => getNextState(state, actions.SUCCESS));
        }
      }
    }

    handleSubmit = () => {
      this.handleCommit(this.props.onSubmit);
    }

    handleUpdate = () => {
      this.handleCommit(this.props.onUpdate);
    }

    handleDelete = () => {
      this.handleCommit(this.props.onDelete);
    }

    render() {
      const {
        props: {value: propsValue},
        state: {value: stateValue, status, onSubmit, onUpdate, onDelete}
      } = this;

      return (
        <WrappedComponent
          {..._.omit(this.props, ['value'])}
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
  }
}
