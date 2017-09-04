import transition, {actions, states} from './state-machine';

import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';
import makeCancelable from './make-cancelable';
import omit from './omit';

export default function withEditable(WrappedComponent) {
  return class ComponentWithEditable extends React.Component {
    static propTypes = {
      onCancel: PropTypes.func,
      onDelete: PropTypes.func,
      onSubmit: PropTypes.func,
      onUpdate: PropTypes.func,
      value: PropTypes.any,
      ...omit(WrappedComponent.propTypes, ['status', 'onStart', 'onCancel', 'onChange']),
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
      const {
        props: {onCancel},
        state: {status, value},
      } = this;

      if (typeof onCancel === 'function' && status === states.EDITING) {
        onCancel(value);
      }

      this.setState((state) => transition(state.status, actions.CANCEL));
    }

    handleCommit = (commitFunc) => {
      invariant(this.state.status !== states.COMMITTING, 'React Editable cannot commit while commiting');
      this.setState((state) => transition(state.status, actions.COMMIT));

      if (typeof commitFunc === 'function') {
        // TODO: find a way to test this async behavior (enzyme makes setState synchronous)
        // May have just started and not yet updated state
        const maybeCommitPromise = commitFunc(this._getValue());

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

    _getValue() {
      return this.state.status === states.PRESENTING ? this.props.value : this.state.value;
    }

    render() {
      const {status} = this.state;

      return (
        <WrappedComponent
          {...omit(this.props, ['value', 'onCancel', 'onSubmit', 'onUpdate', 'onDelete'])}
          onCancel={this.handleCancel}
          onChange={this.handleChange}
          onDelete={this.handleDelete}
          onStart={this.handleStart}
          onSubmit={this.handleSubmit}
          onUpdate={this.handleUpdate}
          status={status}
          value={this._getValue()}
        />
      );
    }
  };
}
