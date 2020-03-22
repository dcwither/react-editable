import { Button, IconButton } from "@material-ui/core";
import { EditableStatus, useEditableContext } from "../src";
import React, { useCallback } from "react";

import Icon from "@material-ui/core/Icon";
import Input from "./input";
import TagSelector from "./tag-selector";
import Typography from "@material-ui/core/Typography";
import { emptyQuestion } from "./constants";
import produce from "immer";

const Buttons = ({ onCancel, onUpdate, onDelete, onCreate, id }) => {
  if (Number.isInteger(id)) {
    return (
      <div className="buttons">
        <Button variant="contained" color="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onUpdate}>
          Update
        </Button>
        <Button variant="contained" color="secondary" onClick={onDelete}>
          Delete
        </Button>
      </div>
    );
  } else {
    return (
      <Button variant="contained" color="primary" onClick={onCreate}>
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
    value
  } = useEditableContext();

  // precompute change handlers to avoid changing props passed to inputs
  const handleChangeTags = useCallback(
    nextTags =>
      onChange(
        produce(value, draft => {
          draft.tags = nextTags;
        })
      ),
    [onChange, value]
  );
  const handleChangeTitle = useCallback(
    nextTitle =>
      onChange(
        produce(value, draft => {
          draft.title = nextTitle;
        })
      ),
    [onChange, value]
  );
  const handleChangeBody = useCallback(
    nextBody =>
      onChange(
        produce(value, draft => {
          draft.body = nextBody;
        })
      ),
    [onChange, value]
  );
  const handleChangeFirstName = useCallback(
    nextFirstName =>
      onChange(
        produce(value, draft => {
          draft.author.firstName = nextFirstName;
        })
      ),
    [onChange, value]
  );
  const handleChangeLastName = useCallback(
    nextLastName =>
      onChange(
        produce(value, draft => {
          draft.author.lastName = nextLastName;
        })
      ),
    [onChange, value]
  );

  const handleCreate = useCallback(() => onCommit("CREATE"), [onCommit]);
  const handleUpdate = useCallback(() => onCommit("UPDATE"), [onCommit]);
  const handleDelete = useCallback(() => onCommit("DELETE"), [onCommit]);

  if (status === EditableStatus.PRESENTING && Number.isInteger(value.id)) {
    return (
      <div className="question">
        <Typography variant="h5" component="h2">
          {value.title}
          <IconButton onClick={onStart}>
            <Icon>mode_edit</Icon>
          </IconButton>
        </Typography>
        <Typography variant="body1">{value.tags.join(", ")}</Typography>
        <Typography variant="body1">{value.body}</Typography>
        <Typography variant="body1">
          - {value.author.firstName} {value.author.lastName}
        </Typography>
      </div>
    );
  } else {
    return (
      <div className="form">
        <div className="fields">
          <Typography variant="h5" component="h2">
            Your Question
          </Typography>
          <TagSelector tags={value.tags} onChange={handleChangeTags} />
          <Input
            title="Title"
            onChange={handleChangeTitle}
            status={status}
            value={value.title}
            fullWidth
          />
          <Input
            title="Body"
            onChange={handleChangeBody}
            status={status}
            value={value.body}
            fullWidth
            multiline
          />
          <Typography variant="title">Author</Typography>
          <Input
            title="First Name"
            onChange={handleChangeFirstName}
            status={status}
            value={value.author.firstName}
            fullWidth
          />
          <Input
            title="Last Name"
            onChange={handleChangeLastName}
            status={status}
            value={value.author.lastName}
            fullWidth
          />
        </div>
        <Buttons
          id={value.id}
          onCancel={onCancel}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </div>
    );
  }
}

QuestionForm.defaultProps = emptyQuestion;
