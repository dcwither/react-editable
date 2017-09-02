import Input from '../examples/input';
import React from 'react';
import SimpleForm from '../examples/simple-form';
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

const FormContainer = compose(
  withState(true),
  withCrud,
  withButtons('start', 'cancel', 'submit', 'delete')
)(SimpleForm);

storiesOf('React CRUD Wrapper', module)
  .add('Simple Input', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <InputWithCrud value='startValue' />;
  }))
  .add('Input With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <InputContainer initialValue='startValue' />;
  }))
  .add('Simple Form With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    return <FormContainer
      initialValue={[
        {title: 'First Name', value: ''},
        {title: 'Last Name', value: ''},
        {title: 'Email', value: ''},
        {title: 'Password', value: ''},
      ]}
    />;
  }));
