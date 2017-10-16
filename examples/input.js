import {EditableState, EditableStateType} from '../src';

import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

export default class Input extends React.Component {
  static propTypes = {
    title: TextField.propTypes.floatingLabelText,
    onChange: PropTypes.func.isRequired,
    status: EditableStateType.isRequired,
    value: PropTypes.string.isRequired,
  }

  handleChange = (evt) => {
    this.props.onChange(evt.target.value);
  }

  render() {
    const {title, status, value} = this.props;
    return <TextField
      disabled={status === EditableState.COMMITTING}
      floatingLabelText={title}
      onChange={this.handleChange}
      value={value}
    />;
  }
}
