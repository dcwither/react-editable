import { EditableStatus, EditableStatusType } from "../src";

import PropTypes from "prop-types";
import React from "react";
import TextField from "material-ui/TextField";

export default class Input extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    status: EditableStatusType.isRequired,
    value: PropTypes.string.isRequired
  };

  handleChange = evt => {
    this.props.onChange(evt.target.value);
  };

  render() {
    const { title, status, value, onChange, ...rest } = this.props;
    return (
      <TextField
        disabled={status === EditableStatus.COMMITTING}
        label={title}
        onChange={this.handleChange}
        value={value}
        {...rest}
      />
    );
  }
}
