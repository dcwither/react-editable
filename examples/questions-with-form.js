import { map, omit, pipe, prop, sortBy, values } from "ramda";

import { Editable } from "../src";
import QuestionForm from "./question-form";
import React from "react";
import { action } from "@storybook/addon-actions";
import { emptyQuestion } from "./constants";

export default class QuestionsWithForm extends React.Component {
  static propTypes = {};

  state = {
    questions: [],
    nextId: 1
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
          questions: omit(prevState.questions, value.id)
        }));
      default:
        throw new Error("bad message");
    }
  };

  renderQuestions = pipe(
    values,
    sortBy(prop("id")),
    map(question => (
      <Editable value={question} onCommit={this.handleCommit}>
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
        {this.renderQuestions(this.state.questions)}
      </div>
    );
  }
}
