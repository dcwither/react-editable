import Input from './input';
import PropTypes from 'prop-types';
import React from 'react';
import {states} from '../src/state-machine';
import update from 'immutability-helper';

export default class Form extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: PropTypes.oneOf(Object.keys(states)).isRequired,
    value: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  }

  handleChange = (inputValue, idx) => {
    const {onChange, value} = this.props;
    onChange(update(value, {
      [idx]: {value: {$set: inputValue}}
    }));
  }

  renderInputs() {
    const {status, value} = this.props;
    return value.map(({title, value: inputValue}, idx) =>
      <li key={idx} className='form-item'>
        <Input
          title={title}
          onChange={(nextValue) => this.handleChange(nextValue, idx)}
          status={status}
          value={inputValue}
        />
      </li>
    );
  }

  render() {
    return <ul className='form'>
      {this.renderInputs()}
    </ul>;
  }
}
