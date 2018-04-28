import Input from "./input";
import PropTypes from "prop-types";
import React from "react";
import { EditableStateType } from "../src";
import { view, set, lensPath, lensProp } from "ramda";

// flip to put the current value ahead of the change
// const tagsLens = lensProp("tags");
const titleLens = lensProp("title");
const bodyLens = lensProp("body");
const firstNameLens = lensPath(["author", "firstName"]);
const lastNameLens = lensPath(["author", "lastName"]);

export default class QuestionForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: EditableStateType.isRequired,
    title: PropTypes.string,
    value: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        author: PropTypes.shape({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired
        })
      })
    )
  };

  static defaultProps = {
    value: {
      tags: ["react", "redux"],
      title: "How do I connect a component to react redux",
      body:
        "I've been doing x, y, and z and it hasn't been working. [Reference](http://example.com) says I should do w but I'm not sure how...",
      author: {
        firstName: "Alice",
        lastName: "B"
      }
    }
  };

  handleChange = lens => newFieldValue => {
    return this.props.onChange(set(lens, newFieldValue, this.props.value));
  };

  handleChangeTitle = this.handleChange(titleLens);
  handleChangeBody = this.handleChange(bodyLens);
  handleChangeFirstName = this.handleChange(firstNameLens);
  handleChangeLastName = this.handleChange(lastNameLens);

  render() {
    const { value, status } = this.props;
    return (
      <div className="form">
        <h3>Your Question</h3>
        <Input
          title="Title"
          onChange={this.handleChangeTitle}
          status={status}
          value={view(titleLens, value)}
        />
        <Input
          title="Body"
          onChange={this.handleChangeBody}
          status={status}
          value={view(bodyLens, value)}
        />
        <h3>Author</h3>
        <Input
          title="First Name"
          onChange={this.handleChangeFirstName}
          status={status}
          value={view(firstNameLens, value)}
        />
        <Input
          title="LastName"
          onChange={this.handleChangeLastName}
          status={status}
          value={view(lastNameLens, value)}
        />
      </div>
    );
  }
}
