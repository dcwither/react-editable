import transition, { Action, Status } from "./state-machine";

const FAKE_ACTION = "FAKE_ACTION";

describe("StateMachine", () => {
  function stateWillTransitionTo(state, actionStatePairs) {
    describe(`${state}`, () => {
      test("META: should check all actions", () => {
        expect(actionStatePairs.map(([action]) => action)).toEqual(
          expect.arrayContaining(Object.keys(Action))
        );
      });

      actionStatePairs.forEach(([action, nextState]) =>
        test(`should change to ${nextState} for ${action}`, () => {
          expect(transition(state, action).status).toEqual(nextState);
        })
      );
    });
  }

  stateWillTransitionTo(Status.PRESENTING, [
    [FAKE_ACTION, Status.PRESENTING],
    [Action.START, Status.EDITING],
    [Action.CANCEL, Status.PRESENTING],
    [Action.CHANGE, Status.EDITING],
    [Action.COMMIT, Status.COMMITTING],
    [Action.FAIL, Status.PRESENTING],
    [Action.SUCCESS, Status.PRESENTING]
  ]);

  stateWillTransitionTo(Status.EDITING, [
    [FAKE_ACTION, Status.EDITING],
    [Action.START, Status.EDITING],
    [Action.CANCEL, Status.PRESENTING],
    [Action.CHANGE, Status.EDITING],
    [Action.COMMIT, Status.COMMITTING],
    [Action.FAIL, Status.EDITING],
    [Action.SUCCESS, Status.EDITING]
  ]);

  stateWillTransitionTo(Status.COMMITTING, [
    [FAKE_ACTION, Status.COMMITTING],
    [Action.START, Status.COMMITTING],
    [Action.CANCEL, Status.COMMITTING],
    [Action.CHANGE, Status.COMMITTING],
    [Action.COMMIT, Status.COMMITTING],
    [Action.FAIL, Status.EDITING],
    [Action.SUCCESS, Status.PRESENTING]
  ]);
});
