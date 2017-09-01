import PropTypes from 'prop-types';
import React from 'react';

export default class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired
  }

  handleChange = (evt) => {
    this.props.onChange(evt.target.value);
  }

  render() {
    return <input
      value={this.props.value}
      onChange={this.handleChange}
    />;
  }
}
