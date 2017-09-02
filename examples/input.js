import PropTypes from 'prop-types';
import React from 'react';
import {states} from '../src/state-machine';

export default class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: PropTypes.oneOf(Object.keys(states)).isRequired,
    value: PropTypes.string.isRequired
  }

  handleChange = (evt) => {
    this.props.onChange(evt.target.value);
  }

  render() {
    const {status, value} = this.props;
    return <input
      disabled={status === states.COMMITING}
      onChange={this.handleChange}
      value={value}
    />;
  }
}
