import transition, {actions, states} from '../src/state-machine';

import {expect} from 'chai';

const FAKE_ACTION = 'FAKE_ACTION';
const FAKE_STATE = 'FAKE_STATE';

describe('StateMachine', () => {
  function stateWillTransitionTo(state, actionStatePairs) {
    describe(`${state}`, () => {
      it('should check all actions', () => {
        expect(actionStatePairs.map(([action]) => action)).to.include.members(Object.keys(actions));
      });

      actionStatePairs.forEach(([action, nextState]) =>
        it(`should change to ${nextState} for ${action}`, () => {
          expect(transition(state, action).status).to.equal(nextState);
        })
      );
    });
  }

  it('should fail when passed invalid state', () => {
    expect(() => transition(FAKE_STATE, FAKE_ACTION)).to.throw;
  });

  stateWillTransitionTo(states.PRESENTING, [
    [FAKE_ACTION, states.PRESENTING],
    [actions.START, states.EDITING],
    [actions.CANCEL, states.PRESENTING],
    [actions.CHANGE, states.EDITING],
    [actions.COMMIT, states.PRESENTING],
    [actions.FAIL, states.PRESENTING],
    [actions.SUCCESS, states.PRESENTING]
  ]);

  stateWillTransitionTo(states.EDITING, [
    [FAKE_ACTION, states.EDITING],
    [actions.START, states.EDITING],
    [actions.CANCEL, states.PRESENTING],
    [actions.CHANGE, states.EDITING],
    [actions.COMMIT, states.COMMITING],
    [actions.FAIL, states.EDITING],
    [actions.SUCCESS, states.EDITING]
  ]);

  stateWillTransitionTo(states.COMMITING, [
    [FAKE_ACTION, states.COMMITING],
    [actions.START, states.COMMITING],
    [actions.CANCEL, states.COMMITING],
    [actions.CHANGE, states.COMMITING],
    [actions.COMMIT, states.COMMITING],
    [actions.FAIL, states.EDITING],
    [actions.SUCCESS, states.PRESENTING]
  ]);
});
