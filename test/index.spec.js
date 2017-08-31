import React from 'react';
import {expect} from 'chai';
// import {shallow} from 'enzyme';
// import sinon from 'sinon';
import withCrud from '../src/index';

class MockComponent extends React.PureComponent {
  render() {
    return <div />;
  }
}

const CrudMockComponent = withCrud(MockComponent);

describe('withCrud', () => {
  describe('smoke tests', () => {
    it('shouldn\'t fatal', () => {
      expect(() => <CrudMockComponent />).not.to.throw;
    })
  })
});
