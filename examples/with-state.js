import Promise from 'bluebird';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import {action} from '@storybook/addon-actions';
import {omit} from 'lodash/fp';

function withState(WrappedComponent, usePromises) {
  return class ComponentWithState extends React.Component {
    static propTypes = {
      initialValue: WrappedComponent.propTypes.value || PropTypes.any,
    };

    state = {
      value: this.props.initialValue,
      isDeleted: false,
    };

    maybeDelayThenSetState(nextState) {
      if (usePromises) {
        return Promise
          .delay(500)
          .then(() => this.setState(nextState));
      } else {
        this.setState(nextState);
      }
    }

    handleSubmit = (value) => {
      action('Submit')(value);
      return this.maybeDelayThenSetState({value});
    }

    handleUpdate = (value) => {
      action('Update')(value);
      return this.maybeDelayThenSetState({value});
    }

    handleDelete = (value) => {
      action('Delete')(value);
      return this.maybeDelayThenSetState({
        value: 'undefined',
        isDeleted: true,
      });
    }

    handleReset = () => {
      this.setState({
        value: this.props.initialValue,
        isDeleted: false,
      });
    }

    render() {
      const {
        state: {value, isDeleted},
        props,
      } = this;

      if (isDeleted) {
        return <div>
          <RaisedButton onClick={this.handleReset} primary label='Item Deleted - Reset' style={{margin: '2em'}}/>
        </div>;
      } else {
        return <WrappedComponent
          onDelete={this.handleDelete}
          onSubmit={this.handleSubmit}
          onUpdate={this.handleUpdate}
          value={value}
          {...omit('initialValue')(props)}
        />;
      }
    }
  };
}

export default (usePromises) => (WrappedComponent) => withState(WrappedComponent, usePromises);
