import Input from '../examples/input';
import React from 'react';
import { storiesOf } from '@storybook/react';
import withCrud from '../src';
import withCrudButtons from '../examples/withCrudButtons';
import { withInfo } from '@storybook/addon-info';

const WrappedInput = withCrud(Input);

const WrappedInputWithButtons = withCrud(withCrudButtons(Input, 'start', 'cancel'));

storiesOf('React CRUD Wrapper', module)
  .add('Simple Input', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <WrappedInput value='startValue' />;
  }))
  .add('Simple Input With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <WrappedInputWithButtons value='startValue' />;
  }));
