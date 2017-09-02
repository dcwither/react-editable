import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React from 'react';

function withState(WrappedComponent, usePromises) {
  return class ComponentWithState extends React.Component {
    static propTypes = {
      initialValue: PropTypes.any
    };

    state = {
      value: this.props.initialValue,
      isDeleted: false
    };

    maybeDelayThenSetState(nextState) {
      if (usePromises) {
        return Promise
          .delay(2000)
          .then(() => this.setState(nextState));
      } else {
        this.setState(nextState);
      }
    }

    handleSubmit = (value) => {
      return this.maybeDelayThenSetState({value});
    }

    handleUpdate = (value) => {
      return this.maybeDelayThenSetState({value});
    }

    handleDelete = () => {
      return this.maybeDelayThenSetState({
        value: 'undefined',
        isDeleted: true
      });
    }

    render() {
      const {
        state: {value, isDeleted}
      } = this;

      if (isDeleted) {
        return <div>Item Deleted</div>;
      } else {
        return <WrappedComponent
          onDelete={this.handleDelete}
          onSubmit={this.handleSubmit}
          onUpdate={this.handleUpdate}
          value={value}
        />;
      }
    }
  };
}

export default (usePromises) => (WrappedComponent) => withState(WrappedComponent, usePromises);
