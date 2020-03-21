import { Button, IconButton } from "material-ui";
import { EditableStatus, EditableStatusType, useEditableContext } from "../src";
import { isNil, lensPath, lensProp, set, view } from "ramda";

import Icon from "material-ui/Icon";
import Input from "./input";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import TagSelector from "./tag-selector";
import Typography from "material-ui/Typography";
import { emptyQuestion } from "./constants";

const tagsLens = lensProp("tags");
const titleLens = lensProp("title");
const bodyLens = lensProp("body");
const firstNameLens = lensPath(["author", "firstName"]);
const lastNameLens = lensPath(["author", "lastName"]);

const Buttons = ({ onCancel, onUpdate, onDelete, onCreate, id }) => {
  if (!isNil(id)) {
    return (
      <React.Fragment>
        <Button variant="raised" color="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="raised" color="primary" onClick={onUpdate}>
          Update
        </Button>
        <Button variant="raised" color="secondary" onClick={onDelete}>
          Delete
        </Button>
      </React.Fragment>
    );
  } else {
    return (
      <Button variant="raised" color="primary" onClick={onCreate}>
        Create
      </Button>
    );
  }
};

export default function QuestionForm() {
  const {
    onCancel,
    onChange,
    onCommit,
    onStart,
    status,
    title,
    value
  } = useEditableContext();

  const handleChange = lens => newFieldValue => {
    return onChange(set(lens, newFieldValue, value));
  };

  // precompute change handlers to avoid changing props passed to inputs
  const handleChangeTags = useCallback(handleChange(tagsLens), [
    onChange,
    value
  ]);
  const handleChangeTitle = useCallback(handleChange(titleLens), [
    onChange,
    value
  ]);
  const handleChangeBody = useCallback(handleChange(bodyLens), [
    onChange,
    value
  ]);
  const handleChangeFirstName = useCallback(handleChange(firstNameLens), [
    onChange,
    value
  ]);
  const handleChangeLastName = useCallback(handleChange(lastNameLens), [
    onChange,
    value
  ]);

  const handleCreate = useCallback(() => onCommit("CREATE"), [onCommit]);
  const handleUpdate = useCallback(() => onCommit("UPDATE"), [onCommit]);
  const handleDelete = useCallback(() => onCommit("DELETE"), [onCommit]);

  if (status === EditableStatus.PRESENTING && !isNil(value.id)) {
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
  } else {
    return (
      <div className="form">
        <div className="fields">
          <Typography variant="headline">Your Question</Typography>
          <TagSelector
            tags={view(tagsLens, value)}
            onChange={handleChangeTags}
          />
          <Input
            title="Title"
            onChange={handleChangeTitle}
            status={status}
            value={view(titleLens, value)}
            fullWidth
          />
          <Input
            title="Body"
            onChange={handleChangeBody}
            status={status}
            value={view(bodyLens, value)}
            fullWidth
            multiline
          />
          <Typography variant="title">Author</Typography>
          <Input
            title="First Name"
            onChange={handleChangeFirstName}
            status={status}
            value={view(firstNameLens, value)}
            fullWidth
          />
          <Input
            title="Last Name"
            onChange={handleChangeLastName}
            status={status}
            value={view(lastNameLens, value)}
            fullWidth
          />
        </div>
        <Buttons
          id={value.id}
          onCancel={onCancel}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    );
  }
}

QuestionForm.defaultProps = emptyQuestion;
