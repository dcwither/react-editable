import Container from '../examples/container';
import DynamicFieldForm from '../examples/dynamic-field-form';
import Form from '../examples/form';
import Input from '../examples/input';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
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
  .add('Input', withInfo('Input wrapped in the CRUD decorator')(() => {
    const InputWithCrud = withCrud(Input);
    return <MuiThemeProvider>
      <Container>
        <InputWithCrud title='Input' value='' />
      </Container>
    </MuiThemeProvider>;
  }))
  .add('Input With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    const InputContainer = composeWithState(Input);
    return <MuiThemeProvider>
      <Container>
        <InputContainer title='Input' initialValue='' />
      </Container>
    </MuiThemeProvider>;
  }))
  .add('Form With Buttons', withInfo('Input wrapped in the CRUD decorator')(() => {
    const FormContainer = composeWithState(Form);
    return <MuiThemeProvider>
      <Container>
        <FormContainer
          initialValue={[
            {title: 'First Name', value: ''},
            {title: 'Last Name', value: ''},
            {title: 'Email', value: ''},
            {title: 'Password', value: ''},
          ]}
        />
    </Container>
    </MuiThemeProvider>;
  }))
  .add('Form With Dynamic Fields', withInfo('Input wrapped in the CRUD decorator')(() => {
    const DynamicFieldFormContainer = composeWithState(DynamicFieldForm);
    return <MuiThemeProvider>
      <Container>
        <DynamicFieldFormContainer initialValue={[{title: 'Field 1', value: ''},]} />
      </Container>
    </MuiThemeProvider>;
  }));
