import PropTypes from 'prop-types';
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import withCrud from '../src/index';

class MockComponent extends React.PureComponent {
  static propTypes = {
    testProp: PropTypes.number
  }

  render() {
    return <div />;
  }
}

const CrudMockComponent = withCrud(MockComponent);

describe('withCrud', () => {
  describe('smoke tests', () => {
    it('shouldn\'t fatal', () => {
      expect(() => <CrudMockComponent />).not.to.throw;
    });

    it('should render MockComponent', () => {
      expect(shallow(<CrudMockComponent />).is(MockComponent)).to.be.true;
    });
  });

  it('should hoist MockComponent props', () => {
    expect(CrudMockComponent.propTypes).to.have.property('testProp');
  });

  it('should pass through props to MockComponent', () => {
    expect(
      shallow(<CrudMockComponent testProp={1} />)
        .find(MockComponent)
        .props()
    ).to.have.property('testProp');
  });
});
