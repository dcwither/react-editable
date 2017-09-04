import Container from './container';
import DynamicFieldForm from '../examples/dynamic-field-form';
import Form from '../examples/form';
import Input from '../examples/input';
import MultiForm from '../examples/multi-form';
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

const accountInformation = [
  {title: 'First Name', value: ''},
  {title: 'Last Name', value: ''},
  {title: 'Email', value: ''},
  {title: 'Password', value: ''},
];

const billingInformaion = [
  {title: 'Province', value: ''},
  {title: 'Street Address', value: ''},
  {title: 'Postal Code', value: ''},
];

storiesOf('ReactEditable', module)
  .addDecorator(Container)
  .add('Input', withInfo('Input wrapped in the Editable decorator')(() => {
    const InputContainer = composeWithState(Input);
    return <InputContainer title='Input' initialValue='' />;
  }))
  .add('Form', withInfo('Form wrapped in the Editable decorator')(() => {
    const FormContainer = composeWithState(Form);
    return <FormContainer
      title='Account Information'
      initialValue={accountInformation}
    />;
  }))
  .add('Multi-Form', withInfo('Multi-Form in the Editable decorator')(() => {
    const MultiFormContainer = composeWithState(MultiForm);
    return <MultiFormContainer
      title='Sign Up'
      initialValue={[
        {title: 'Account Information', value: accountInformation},
        {title: 'Billing', value: billingInformaion},
      ]}
    />;
  }))
  .add('Form With Dynamic Fields', withInfo('Form with dynamic fields wrapped in the Editable decorator')(() => {
    const DynamicFieldFormContainer = composeWithState(DynamicFieldForm);
    return <DynamicFieldFormContainer initialValue={[{title: 'Field 1', value: ''}]} />;
  }));
