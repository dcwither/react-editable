import FieldListForm from '../examples/field-list-form';
import Input from '../examples/input';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
    return <MuiThemeProvider>
      <InputWithCrud title='Input' value='' />
    </MuiThemeProvider>;
  }))
  .add('Input With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    const InputContainer = composeWithState(Input);
    return <MuiThemeProvider>
      <InputContainer title='Input' initialValue='' />
    </MuiThemeProvider>;
  }))
  .add('Simple Form With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    const FormContainer = composeWithState(SimpleForm);
    return <MuiThemeProvider>
      <FormContainer
        initialValue={[
          {title: 'First Name', value: ''},
          {title: 'Last Name', value: ''},
          {title: 'Email', value: ''},
          {title: 'Password', value: ''},
        ]}
      />
    </MuiThemeProvider>;
  }))
  .add('Form With Dynamic Fields', withInfo('Input wrapped in the CRUD decorator')(() => {
    const FieldListFormContainer = composeWithState(FieldListForm);
    return <MuiThemeProvider>
      <FieldListFormContainer initialValue={[{title: 'Field 1', value: ''},]} />
    </MuiThemeProvider>;
  }));
