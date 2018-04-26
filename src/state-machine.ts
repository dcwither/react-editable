export enum Status {
  PRESENTING = "PRESENTING",
  EDITING = "EDITING",
  COMMITTING = "COMMITTING"
}

export enum Action {
  CANCEL = "CANCEL",
  CHANGE = "CHANGE",
  COMMIT = "COMMIT",
  FAIL = "FAIL",
  START = "START",
  SUCCESS = "SUCCESS"
}

export type State<TValue> = {
  status: Status;
  value?: TValue;
};

function edit<TValue>(value: TValue): State<TValue> {
  return {
    status: Status.EDITING,
    value
  };
}

function reset<TValue>(): State<TValue> {
  return {
    status: Status.PRESENTING,
    value: undefined
  };
}

export const transitions = {
  PRESENTING: {
    START: edit,
    CHANGE: edit,
    COMMIT: value => ({ status: Status.COMMITTING, value })
  },
  EDITING: {
    CANCEL: reset,
    CHANGE: edit,
    COMMIT: () => ({ status: Status.COMMITTING })
  },
  COMMITTING: {
    FAIL: () => ({ status: Status.EDITING }),
    SUCCESS: reset
  }
};

export default function transition<TValue>(
  status: Status,
  action: Action,
  value?: TValue
): State<TValue> {
  return transitions[status][action]
    ? transitions[status][action](value)
    : { status };
}
