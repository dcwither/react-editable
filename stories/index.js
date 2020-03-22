import Container from "./container";
import EditableReadme from "../README.md";
import QuestionForm from "../examples/question-form";
import QuestionsWithForm from "../examples/questions-with-form";
import React from "react";
import { storiesOf } from "@storybook/react";
import { Editable } from "../src";
import withReadme from "storybook-readme/with-readme";

// eslint-disable-next-line no-undef
storiesOf("ReactEditable", module)
  .addDecorator(withReadme(EditableReadme))
  .addDecorator(Container)
  .add("Question Form", () => {
    return (
      <Editable
        value={{
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
        onCommit={console.log}
        onCancel={console.log}
      >
        <QuestionForm />
      </Editable>
    );
  })
  .add("Question Form List", () => {
    return <QuestionsWithForm />;
  });
