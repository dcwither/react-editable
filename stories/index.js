import Container from "./container";
import EditableReadme from "../README.md";
import React from "react";
import { compose } from "ramda";
import { storiesOf } from "@storybook/react";
import { withEditable } from "../src";
import withReadme from "storybook-readme/with-readme";
import withState from "../examples/with-state";
import QuestionForm from "../examples/question-form";

const composeWithState = compose(withState(true), withEditable);

storiesOf("ReactEditable", module)
  .addDecorator(withReadme(EditableReadme))
  .addDecorator(Container)
  .add("Question Form", () => {
    const FormContainer = composeWithState(QuestionForm);
    return <FormContainer />;
  });
