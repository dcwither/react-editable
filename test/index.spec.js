import PropTypes from 'prop-types';
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {states} from '../src/state-machine';
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
    ).to.include({
      testProp: 1,
      value: undefined,
      status: states.PRESENTING
    }).and.to.have.all.keys([
      'onStart',
      'onCancel',
      'onChange',
      'onSubmit',
      'onUpdate',
      'onDelete'
    ]);
  });

  describe(`when status is ${states.PRESENTING}`, () => {
    it(`should transition to ${states.EDITING} when onStart is called`, () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' />);
      wrapper.find(MockComponent).props().onStart();
      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'propsValue'
      });
    });

    it(`should transition to ${states.EDITING} when onChange is called`, () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' />);
      wrapper.find(MockComponent).props().onChange('newValue');
      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'newValue'
      });
    });

    it('should be able to delete', () => {
      const deleteSpy = sinon.spy();
      const wrapper = shallow(<CrudMockComponent value='propsValue' onDelete={deleteSpy} />);
      wrapper
        .find(MockComponent)
        .props()
        .onDelete();

      expect(deleteSpy.calledWith('propsValue')).to.be.true;
    });
  });

  describe(`when status is ${states.EDITING}`, () => {
    it('should update value when onChange is called', () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue'
        })
        .find(MockComponent)
        .props()
        .onChange('newValue');

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'newValue'
      });
    });

    it('should not change when onStart is called', () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue'
        })
        .find(MockComponent)
        .props()
        .onStart();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'stateValue'
      });
    });

    it(`should transition to ${states.PRESENTING} when onSubmit is called without promise`, () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' onSubmit={() => {}} />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue'
        })
        .find(MockComponent)
        .props()
        .onSubmit();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.PRESENTING,
        value: 'propsValue'
      });
    });

    it(`should transition to ${states.COMMITING} when onSubmit is called with promise`, () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue'
        })
        .find(MockComponent)
        .props()
        .onSubmit();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.COMMITING,
        value: 'stateValue'
      });
    });
  });

  describe(`when status is ${states.COMMITING}`, () => {
    it(`should transition to ${states.PRESENTING} when promise resolves`, () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
      return wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue'
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        .then(() =>
          expect(
            wrapper.find(MockComponent).props()
          ).to.include({
            status: states.PRESENTING,
            value: 'propsValue'
          })
        );
    });

    it(`should transition to ${states.PRESENTING} when promise rejects`, () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' onSubmit={() => Promise.reject()} />);
      return wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue'
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        .then(() =>
          expect(
            wrapper.find(MockComponent).props()
          ).to.include({
            status: states.EDITING,
            value: 'stateValue'
          })
        );
    });

    it('promise should cancel when unmount', () => {
      const wrapper = shallow(<CrudMockComponent value='propsValue' onDelete={() => Promise.reject()} />);
      const instance = wrapper.instance();
      sinon.spy(instance, 'setState');
      const promise = wrapper
        .find(MockComponent)
        .props()
        .onDelete()
        // isn't called a third time with a failure
        .then(() => expect(instance.setState.callCount).to.equal(2));

      wrapper.unmount();
      return promise;
    });
  });
});
