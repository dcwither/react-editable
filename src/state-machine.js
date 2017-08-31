export const states = {
  PRESENTING: 'PRESENTING',
  EDITING: 'EDITING',
  COMMITING: 'COMMITING'
};

export const actions = {
  CANCEL: 'CANCEL',
  CHANGE: 'CHANGE',
  COMMIT: 'COMMIT',
  FAIL: 'FAIL',
  SUCCESS: 'SUCCESS'
};

export const transitions = {
  PRESENTING: {
    CHANGE: states.EDITING
  },
  EDITING: {
    CANCEL: states.PRESENTING,
    CHANGE: states.EDITING,
    COMMIT: states.COMMITING
  },
  COMMITING: {
    FAIL: states.EDITING,
    SUCCESS: states.PRESENTING
  }
};

export default function transition(state, transition) {
  return transitions[state][transition] || state;
}
