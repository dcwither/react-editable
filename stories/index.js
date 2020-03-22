import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Container from "./container";
import { Editable } from "../src";
import EditableReadme from "../README.md";
import Promise from "bluebird";
import QuestionForm from "../examples/question-form";
import QuestionsWithForm from "../examples/questions-with-form";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import withReadme from "storybook-readme/with-readme";

function TestHarness({ initialValue, async }) {
  const [value, setValue] = useState(initialValue);
  const [deleted, setDeleted] = useState(false);

  const maybeDelayThenSetState = (value, deleted) => {
    if (async) {
      return Promise.delay(1000).then(() => {
        setValue(value);
        setDeleted(deleted);
      });
    } else {
      setValue(value);
      setDeleted(deleted);
    }
  };

  const handleCommit = (message, value) => {
    action(message)(value);
    switch (message) {
      case "CREATE":
      case "UPDATE":
        return maybeDelayThenSetState(value, false);
      case "DELETE":
        return maybeDelayThenSetState(initialValue, true);
      default:
        throw new Error("bad message");
    }
  };

  const handleReset = () => {
    setDeleted(false);
  };

  return deleted ? (
    <Button
      onClick={handleReset}
      color="primary"
      variant="contained"
      style={{ margin: "2em" }}
    >
      Item Deleted - Reset
    </Button>
  ) : (
    <Editable value={value} onCommit={handleCommit} onCancel={action("CANCEL")}>
      <QuestionForm />
    </Editable>
  );
}
// eslint-disable-next-line no-undef
storiesOf("ReactEditable", module)
  .addDecorator(withReadme(EditableReadme))
  .addDecorator(Container)
  .add("Question Form", () => {
    return (
      <TestHarness
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
  .add("Question Form Async", () => {
    return (
      <TestHarness
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
        async
      />
    );
  })
  .add("Question Form List", () => {
    return <QuestionsWithForm />;
  });
