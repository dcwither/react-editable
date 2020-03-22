import { EditableStatus, EditableStatusType } from "../src";

import PropTypes from "prop-types";
import React from "react";
import TextField from "material-ui/TextField";

export default class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: EditableStatusType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  };

  handleChange = evt => {
    this.props.onChange(evt.target.value);
  };

  render() {
    const { title, status, value, ...rest } = this.props;
    return (
      <TextField
        {...rest}
        disabled={status === EditableStatus.COMMITTING}
        label={title}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}
