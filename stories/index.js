import FieldListForm from '../examples/field-list-form';
import Input from '../examples/input';
import React from 'react';
import SimpleForm from '../examples/simple-form';
import {compose} from 'lodash/fp';
import {storiesOf} from '@storybook/react';
import withButtons from '../examples/with-buttons';
import withCrud from '../src';
import {withInfo} from '@storybook/addon-info';
import withState from '../examples/with-state';

const composeWithState = compose(
  withState(true),
  withCrud,
  withButtons('start', 'cancel', 'submit', 'delete')
);

storiesOf('React CRUD Wrapper', module)
  .add('Simple Input', withInfo('Input wrapped in the CRUD decorator')(() => {
    const InputWithCrud = withCrud(Input);
    return <InputWithCrud value='startValue' />;
  }))
  .add('Input With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    const InputContainer = composeWithState(Input);
    return <InputContainer initialValue='startValue' />;
  }))
  .add('Simple Form With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    const FormContainer = composeWithState(SimpleForm);
    return <FormContainer
      initialValue={[
        {title: 'First Name', value: ''},
        {title: 'Last Name', value: ''},
        {title: 'Email', value: ''},
        {title: 'Password', value: ''},
      ]}
    />;
  }))
  .add('Form With Dynamic Fields', withInfo('Input wrapped in the CRUD decorator')(() => {
    const FieldListFormContainer = composeWithState(FieldListForm);
    return <FieldListFormContainer
      initialValue={[]}
    />;
  }));
