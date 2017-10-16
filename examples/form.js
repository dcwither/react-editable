import Input from './input';
import PropTypes from 'prop-types';
import React from 'react';
import {EditableStateType} from '../src';
import update from 'immutability-helper';

export default class Form extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: EditableStateType.isRequired,
    title: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }

  handleChange = (inputValue, idx) => {
    const {onChange, value} = this.props;
    onChange(update(value, {
      [idx]: {value: {$set: inputValue}},
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
    const {title} = this.props;
    return <div className='form'>
      {title && <h3>{title}</h3>}
      <ul>
        {this.renderInputs()}
      </ul>
    </div>;
  }
}
