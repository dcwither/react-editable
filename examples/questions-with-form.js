import { Editable } from "../src";
import QuestionForm from "./question-form";
import React from "react";
import { action } from "@storybook/addon-actions";
import { emptyQuestion } from "./constants";
import produce from "immer";

const update = produce((draft, action) => {
  switch (action.type) {
    case "CREATE":
      draft.questions[draft.nextId] = { ...action.value, id: draft.nextId };
      draft.nextId += 1;
      return;
    case "UPDATE":
      draft.questions[action.value.id] = action.value;
      return;
    case "DELETE":
      delete draft.questions[action.value.id];
      return;
    default:
      throw new Error("bad message");
  }
});

export default class QuestionsWithForm extends React.Component {
  static propTypes = {};

  state = {
    nextId: 2,
    questions: {
      1: {
        author: {
          firstName: "Bob",
          lastName: "B"
        },
        body: "I installed package x and now my code doesn't work.",
        id: 1,
        tags: ["javascript"],
        title: "I have a bug"
      },
      0: {
        author: {
          firstName: "Alice",
          lastName: "A"
        },
        body:
          "I've been doing x, y, and z and it hasn't been working. [Reference](http://example.com) says I should do w but I'm not sure how...",
        id: 0,
        tags: ["react", "redux"],
        title: "How do I connect a component to react redux"
      }
    }
  };

  handleCommit = (message, value) => {
    action(message)(value);
    this.setState(update(this.state, { type: message, value }));
  };

  render() {
    return (
      <div>
        <Editable value={emptyQuestion} onCommit={this.handleCommit}>
          <QuestionForm />
        </Editable>
        <div className="asked-questions">
          {Object.values(this.state.questions)
            .sort(({ id: id1 }, { id: id2 }) => id2 - id1)
            .map(question => (
              <Editable
                key={question.id}
                value={question}
                onCommit={this.handleCommit}
              >
                <QuestionForm />
              </Editable>
            ))}
        </div>
      </div>
    );
  }
}
