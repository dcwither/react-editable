import Container from "./container";
import EditableReadme from "../README.md";
import QuestionForm from "../examples/question-form";
import QuestionsWithForm from "../examples/questions-with-form";
import React from "react";
import { compose } from "ramda";
import { storiesOf } from "@storybook/react";
import { withEditable } from "../src";
import withReadme from "storybook-readme/with-readme";
import withState from "../examples/with-state";

const composeWithState = compose(withState(true), withEditable);

storiesOf("ReactEditable", module)
  .addDecorator(withReadme(EditableReadme))
  .addDecorator(Container)
  .add("Question Form", () => {
    const FormContainer = composeWithState(QuestionForm);
    return (
      <FormContainer
        initialValue={{
          author: {
            firstName: "Alice",
            lastName: "B"
          },
          body:
            "I've been doing x, y, and z and it hasn't been working. [Reference](http://example.com) says I should do w but I'm not sure how...",
          id: 1,
          tags: ["react", "redux"],
          title: "How do I connect a component to react redux"
        }}
      />
    );
  })
  .add("Question Form List", () => {
    return <QuestionsWithForm />;
  });
