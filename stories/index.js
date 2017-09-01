import PropTypes from 'prop-types';
import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import withCrud from '../src';

class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired
  }

  changeAction = action('Change');

  handleChange = (evt) => {
    this.changeAction(evt);
    this.props.onChange(evt.target.value);
  }

  render() {
    return <input
      value={this.props.value}
      onChange={this.handleChange}
    />;
  }
}

const WrappedInput = withCrud(Input);
storiesOf('React CRUD Wrapper', module)
  .add('to Storybook', () =>
    <WrappedInput value='startValue' />
  );
