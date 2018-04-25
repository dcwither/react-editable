export const states = {
  PRESENTING: "PRESENTING",
  EDITING: "EDITING",
  COMMITTING: "COMMITTING"
};

export const actions = {
  CANCEL: "CANCEL",
  CHANGE: "CHANGE",
  COMMIT: "COMMIT",
  FAIL: "FAIL",
  START: "START",
  SUCCESS: "SUCCESS"
};

function edit(value) {
  return {
    status: states.EDITING,
    value
  };
}

function reset() {
  return {
    status: states.PRESENTING,
    value: undefined
  };
}

export const transitions = {
  PRESENTING: {
    START: edit,
    CHANGE: edit,
    COMMIT: value => ({ status: states.COMMITTING, value })
  },
  EDITING: {
    CANCEL: reset,
    CHANGE: edit,
    COMMIT: () => ({ status: states.COMMITTING })
  },
  COMMITTING: {
    FAIL: () => ({ status: states.EDITING }),
    SUCCESS: reset
  }
};

export default function transition(status, action, value?) {
  return transitions[status][action]
    ? transitions[status][action](value)
    : { status };
}
