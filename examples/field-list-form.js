import PropTypes from 'prop-types';
import React from 'react';
import SimpleForm from './simple-form';
import {states} from '../src/state-machine';
import update from 'immutability-helper';

export default class FieldListForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: PropTypes.oneOf(Object.keys(states)).isRequired,
    value: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  }

  state = {
    fieldName: ''
  }

  handleAddField = () => {
    const {
      state: {fieldName},
      props: {onChange, value}
    } = this;

    onChange(update(value, {
      $push: [{title: fieldName, value: ''}]
    }));

    this.setState({
      fieldName: ''
    });
  }

  handleChangeFieldName = (evt) => {
    this.setState({fieldName: evt.target.value});
  }

  render() {
    return <div>
      <SimpleForm {...this.props} />
      <input onChange={this.handleChangeFieldName} value={this.state.fieldName} />
      {' '}
      <button onClick={this.handleAddField}>Add Field</button>
    </div>;
  }
}
