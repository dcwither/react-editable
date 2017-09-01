import Input from '../examples/input';
import React from 'react';
import { storiesOf } from '@storybook/react';
import withCrud from '../src';
import { withInfo } from '@storybook/addon-info';

const WrappedInput = withCrud(Input);

storiesOf('React CRUD Wrapper', module)
  .add('Simple Input', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <WrappedInput value='startValue' />;
  }));
