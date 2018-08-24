import { map, omit, pipe, prop, reverse, sortBy, values } from "ramda";

import { Editable } from "../src";
import QuestionForm from "./question-form";
import React from "react";
import { action } from "@storybook/addon-actions";
import { emptyQuestion } from "./constants";

export default class QuestionsWithForm extends React.Component {
  static propTypes = {};

  state = {
    nextId: 2,
    questions: {
      0: {
        author: {
          firstName: "Bob",
          lastName: "B"
        },
        body: "I installed package x and now my code doesn't work.",
        id: 0,
        tags: ["javascript"],
        title: "I have a bug"
      },
      1: {
        author: {
          firstName: "Alice",
          lastName: "A"
        },
        body:
          "I've been doing x, y, and z and it hasn't been working. [Reference](http://example.com) says I should do w but I'm not sure how...",
        id: 1,
        tags: ["react", "redux"],
        title: "How do I connect a component to react redux"
      }
    }
  };

  handleCommit = (message, value) => {
    action(message)(value);
    switch (message) {
      case "CREATE":
        return this.setState(prevState => ({
          nextId: prevState.nextId + 1,
          questions: {
            ...prevState.questions,
            [prevState.nextId]: {
              ...value,
              id: prevState.nextId
            }
          }
        }));
      case "UPDATE":
        return this.setState(prevState => ({
          questions: { ...prevState.questions, [value.id]: value }
        }));
      case "DELETE":
        return this.setState(prevState => ({
          questions: omit([value.id], prevState.questions)
        }));
      default:
        throw new Error("bad message");
    }
  };

  renderQuestions = pipe(
    values,
    sortBy(prop("id")),
    reverse,
    map(question => (
      <Editable key={question.id} value={question} onCommit={this.handleCommit}>
        {editableProps => <QuestionForm {...editableProps} />}
      </Editable>
    ))
  );

  render() {
    return (
      <div>
        <Editable value={emptyQuestion} onCommit={this.handleCommit}>
          {editableProps => <QuestionForm {...editableProps} />}
        </Editable>
        <div className="asked-questions">
          {this.renderQuestions(this.state.questions)}
        </div>
      </div>
    );
  }
}
