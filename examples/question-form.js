import { Button, IconButton } from "material-ui";
import { EditableStatus, EditableStatusType } from "../src";
import { isNil, lensPath, lensProp, set, view } from "ramda";

import Icon from "material-ui/Icon";
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
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    status: EditableStatusType.isRequired,
    title: PropTypes.string,
    value: PropTypes.shape({
      author: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
      }),
      body: PropTypes.string.isRequired,
      id: PropTypes.number,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired
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

  handleCreate = () => this.props.onCommit("CREATE");
  handleUpdate = () => this.props.onCommit("UPDATE");
  handleDelete = () => this.props.onCommit("DELETE");

  renderButtons() {
    const {
      value: { id },
      onCancel
    } = this.props;
    if (id) {
      return (
        <React.Fragment>
          <Button variant="raised" color="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="raised" color="primary" onClick={this.handleUpdate}>
            Update
          </Button>
          <Button
            variant="raised"
            color="secondary"
            onClick={this.handleDelete}
          >
            Delete
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <Button variant="raised" color="primary" onClick={this.handleCreate}>
          Create
        </Button>
      );
    }
  }

  renderEditing() {
    const { value, status } = this.props;

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
            title="Last Name"
            onChange={this.handleChangeLastName}
            status={status}
            value={view(lastNameLens, value)}
            fullWidth
          />
        </div>
        <div className="buttons">{this.renderButtons()}</div>
      </div>
    );
  }

  renderPresenting() {
    const { value, onStart } = this.props;
    return (
      <div className="question">
        <Typography variant="title">
          {view(titleLens, value)}
          <IconButton onClick={onStart}>
            <Icon>mode_edit</Icon>
          </IconButton>
        </Typography>
        <Typography variant="subheading">
          {view(tagsLens, value).join(", ")}
        </Typography>
        <Typography variant="body1">{view(bodyLens, value)}</Typography>
        <Typography variant="body1">
          - {view(firstNameLens, value)} {view(lastNameLens, value)}
        </Typography>
      </div>
    );
  }

  render() {
    const {
      status,
      value: { id }
    } = this.props;
    if (status === EditableStatus.PRESENTING && !isNil(id)) {
      return this.renderPresenting();
    } else {
      return this.renderEditing();
    }
  }
}
