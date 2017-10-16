import FlatButton from 'material-ui/FlatButton';
import Form from './form';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';
import {isEmpty} from 'lodash/fp';
import {EditableStateType} from '../src';
import update from 'immutability-helper';

export default class DynamicFieldForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: EditableStateType.isRequired,
    value: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }

  state = {
    fieldName: '',
  }

  handleAddField = () => {
    const {
      state: {fieldName},
      props: {onChange, value},
    } = this;

    onChange(update(value, {
      $push: [{title: fieldName, value: ''}],
    }));

    this.setState({
      fieldName: '',
    });
  }

  handleChangeFieldName = (evt) => {
    this.setState({fieldName: evt.target.value});
  }

  render() {
    const {fieldName} = this.state;
    return <div>
      <Form {...this.props} />
      <div>
        <TextField
          floatingLabelText='Field Name'
          onChange={this.handleChangeFieldName}
          style={{marginRight: '1em'}}
          value={this.state.fieldName}
        />
        <FlatButton
          disabled={isEmpty(fieldName)}
          label='Add Field'
          onClick={this.handleAddField}
        />
      </div>
    </div>;
  }
}
