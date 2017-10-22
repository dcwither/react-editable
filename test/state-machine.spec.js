import transition, {actions, states} from '../src/state-machine';

const FAKE_ACTION = 'FAKE_ACTION';
const FAKE_STATE = 'FAKE_STATE';

describe('StateMachine', () => {
  function stateWillTransitionTo(state, actionStatePairs) {
    describe(`${state}`, () => {
      test('META: should check all actions', () => {
        expect(
          actionStatePairs.map(([action]) => action)
        ).toEqual(expect.arrayContaining(Object.keys(actions)));
      });

      actionStatePairs.forEach(([action, nextState]) =>
        test(`should change to ${nextState} for ${action}`, () => {
          expect(transition(state, action).status).toEqual(nextState);
        })
      );
    });
  }

  test('should fail when passed invalid state', () => {
    expect(() => transition(FAKE_STATE, FAKE_ACTION)).toThrow();
  });

  stateWillTransitionTo(states.PRESENTING, [
    [FAKE_ACTION, states.PRESENTING],
    [actions.START, states.EDITING],
    [actions.CANCEL, states.PRESENTING],
    [actions.CHANGE, states.EDITING],
    [actions.COMMIT, states.COMMITTING],
    [actions.FAIL, states.PRESENTING],
    [actions.SUCCESS, states.PRESENTING],
  ]);

  stateWillTransitionTo(states.EDITING, [
    [FAKE_ACTION, states.EDITING],
    [actions.START, states.EDITING],
    [actions.CANCEL, states.PRESENTING],
    [actions.CHANGE, states.EDITING],
    [actions.COMMIT, states.COMMITTING],
    [actions.FAIL, states.EDITING],
    [actions.SUCCESS, states.EDITING],
  ]);

  stateWillTransitionTo(states.COMMITTING, [
    [FAKE_ACTION, states.COMMITTING],
    [actions.START, states.COMMITTING],
    [actions.CANCEL, states.COMMITTING],
    [actions.CHANGE, states.COMMITTING],
    [actions.COMMIT, states.COMMITTING],
    [actions.FAIL, states.EDITING],
    [actions.SUCCESS, states.PRESENTING],
  ]);
});
