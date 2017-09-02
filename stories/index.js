import Input from '../examples/input';
import React from 'react';
import {compose} from 'lodash/fp';
import {storiesOf} from '@storybook/react';
import withButtons from '../examples/with-buttons';
import withCrud from '../src';
import {withInfo} from '@storybook/addon-info';
import withState from '../examples/with-state';

const InputWithCrud = withCrud(Input);

const InputContainer = compose(
  withState(true),
  withCrud,
  withButtons('start', 'cancel', 'submit', 'delete')
)(Input);

storiesOf('React CRUD Wrapper', module)
  .add('Simple Input', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <InputWithCrud value='startValue' />;
  }))
  .add('Simple Input With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <InputContainer initialValue='startValue' />;
  }));
