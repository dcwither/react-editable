import transition, {actions, states} from '../src/state-machine';

import {expect} from 'chai';
import sinon from 'sinon';

describe('StateMachine', () => {
  it('defaults to current state for invalid action', () => {
    expect(transition(states.PRESENTING, 'FAKE_ACTION')).to.equal(states.PRESENTING);
    expect(transition(states.EDITING, 'FAKE_ACTION')).to.equal(states.EDITING);
    expect(transition(states.COMMITING, 'FAKE_ACTION')).to.equal(states.COMMITING);
  })
});
