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
  [states.PRESENTING]: {
    [actions.CHANGE]: states.EDITING
  },
  [states.EDITING]: {
    [actions.CANCEL]: states.PRESENTING,
    [actions.CHANGE]: states.EDITING,
    [actions.COMMIT]: states.COMMITING
  },
  [states.COMMITING]: {
    [actions.FAIL]: states.EDITING,
    [actions.SUCCESS]: states.PRESENTING
  }
};

export default function transition(state, transition) {
  return transitions[state][transition] || state;
}
