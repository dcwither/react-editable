import {EditableStateType} from '../src';
import Form from './form';
import PropTypes from 'prop-types';
import React from 'react';
import update from 'immutability-helper';

export default class MultiForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: EditableStateType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.shape({
      title: Form.propTypes.title,
      value: Form.propTypes.value,
    })).isRequired,
  }

  handleChange = (subFormValue, idx) => {
    const {onChange, value} = this.props;
    onChange(update(value, {
      [idx]: {value: {$set: subFormValue}},
    }));
  }

  renderSubForms() {
    const {status, value} = this.props;
    return value.map(({title, value: subFormValue}, idx) =>
      <li key={idx} className='multi-form-item'>
        <Form
          title={title}
          onChange={(nextValue) => this.handleChange(nextValue, idx)}
          status={status}
          value={subFormValue}
        />
      </li>
    );
  }

  render() {
    const {title} = this.props;
    return <div className='multi-form'>
      {title && <h2>{title}</h2>}
      <ul>
        {this.renderSubForms()}
      </ul>
    </div>;
  }
}
