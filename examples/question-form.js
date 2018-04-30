import { lensPath, lensProp, set, view } from "ramda";

import { Button } from "material-ui";
import { EditableStatusType } from "../src";
import Input from "./input";
import PropTypes from "prop-types";
import React from "react";
import TagSelector from "./tag-selector";
import Typography from "material-ui/Typography";
import { emptyQuestion } from "./constants";

const tagsLens = lensProp("tags");
const titleLens = lensProp("title");
const bodyLens = lensProp("body");
const firstNameLens = lensPath(["author", "firstName"]);
const lastNameLens = lensPath(["author", "lastName"]);

export default class QuestionForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    status: EditableStatusType.isRequired,
    title: PropTypes.string,
    value: PropTypes.shape({
      id: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      author: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
      })
    })
  };

  static defaultProps = emptyQuestion;

  handleChange = lens => newFieldValue => {
    return this.props.onChange(set(lens, newFieldValue, this.props.value));
  };

  // precompute change handlers to avoid changing props passed to inputs
  handleChangeTags = this.handleChange(tagsLens);
  handleChangeTitle = this.handleChange(titleLens);
  handleChangeBody = this.handleChange(bodyLens);
  handleChangeFirstName = this.handleChange(firstNameLens);
  handleChangeLastName = this.handleChange(lastNameLens);

  handleDelete = () => this.props.onCommit("DELETE");
  handleSubmit = () => this.props.onCommit("CREATE");

  render() {
    const { value, status, onCancel } = this.props;
    console.log("form", value);

    return (
      <div className="form">
        <div className="fields">
          <Typography variant="headline">Your Question</Typography>
          <TagSelector
            tags={view(tagsLens, value)}
            onChange={this.handleChangeTags}
          />
          <Input
            title="Title"
            onChange={this.handleChangeTitle}
            status={status}
            value={view(titleLens, value)}
            fullWidth
          />
          <Input
            title="Body"
            onChange={this.handleChangeBody}
            status={status}
            value={view(bodyLens, value)}
            fullWidth
            multiline
          />
          <Typography variant="title">Author</Typography>
          <Input
            title="First Name"
            onChange={this.handleChangeFirstName}
            status={status}
            value={view(firstNameLens, value)}
            fullWidth
          />
          <Input
            title="LastName"
            onChange={this.handleChangeLastName}
            status={status}
            value={view(lastNameLens, value)}
            fullWidth
          />
        </div>
        <div className="buttons">
          <Button variant="raised" color="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="raised" color="primary" onClick={this.handleSubmit}>
            Submit
          </Button>
          <Button
            variant="raised"
            color="secondary"
            onClick={this.handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }
}
