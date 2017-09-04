import Container from './container';
import DynamicFieldForm from '../examples/dynamic-field-form';
import Form from '../examples/form';
import Input from '../examples/input';
import React from 'react';
import {compose} from 'lodash/fp';
import {storiesOf} from '@storybook/react';
import withButtons from '../examples/with-buttons';
import withEditable from '../src';
import {withInfo} from '@storybook/addon-info';
import withState from '../examples/with-state';

const composeWithState = compose(
  withState(true),
  withEditable,
  withButtons('start', 'cancel', 'submit', 'delete')
);

storiesOf('ReactEditable', module)
  .addDecorator(Container)
  .add('Input', withInfo('Input wrapped in the Editable decorator')(() => {
    const InputWithEditable = withEditable(Input);
    return <InputWithEditable title='Input' value='' />;
  }))
  .add('Input With Buttons', withInfo('Input wrapped in the Editable decorator')(() => {
    const InputContainer = composeWithState(Input);
    return <InputContainer title='Input' initialValue='' />;
  }))
  .add('Form With Buttons', withInfo('Input wrapped in the Editable decorator')(() => {
    const FormContainer = composeWithState(Form);
    return <FormContainer
      initialValue={[
        {title: 'First Name', value: ''},
        {title: 'Last Name', value: ''},
        {title: 'Email', value: ''},
        {title: 'Password', value: ''},
      ]}
    />;
  }))
  .add('Form With Dynamic Fields', withInfo('Input wrapped in the Editable decorator')(() => {
    const DynamicFieldFormContainer = composeWithState(DynamicFieldForm);
    return <DynamicFieldFormContainer initialValue={[{title: 'Field 1', value: ''}]} />;
  }));
