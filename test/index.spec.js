import PropTypes from 'prop-types';
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {states} from '../src/state-machine';
import withEditable from '../src/index';

class MockComponent extends React.PureComponent {
  static propTypes = {
    testProp: PropTypes.number,
  }

  render() {
    return <div />;
  }
}

const EditableMockComponent = withEditable(MockComponent);

describe('withEditable', () => {
  describe('smoke tests', () => {
    it('shouldn\'t fatal', () => {
      expect(() => <EditableMockComponent />).not.to.throw;
    });

    it('should render MockComponent', () => {
      expect(shallow(<EditableMockComponent />).is(MockComponent)).to.be.true;
    });
  });

  it('should hoist MockComponent props', () => {
    expect(EditableMockComponent.propTypes).to.have.property('testProp');
  });

  it('should pass through props to MockComponent', () => {
    expect(
      shallow(<EditableMockComponent testProp={1} />)
        .find(MockComponent)
        .props()
    ).to.include({
      testProp: 1,
      value: undefined,
      status: states.PRESENTING,
    }).and.to.have.all.keys([
      'onStart',
      'onCancel',
      'onChange',
      'onSubmit',
      'onUpdate',
      'onDelete',
    ]);
  });

  describe(`when status is ${states.PRESENTING}`, () => {
    it(`should transition to ${states.EDITING} when onStart is called`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper.find(MockComponent).props().onStart();
      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'propsValue',
      });
    });

    it(`should transition to ${states.EDITING} when onChange is called`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper.find(MockComponent).props().onChange('newValue');
      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'newValue',
      });
    });

    it('should be able to delete', () => {
      const deleteSpy = sinon.spy();
      const wrapper = shallow(<EditableMockComponent value='propsValue' onDelete={deleteSpy} />);
      wrapper
        .find(MockComponent)
        .props()
        .onDelete();

      expect(deleteSpy).to.have.been.calledWith('propsValue');
    });
  });

  describe(`when status is ${states.EDITING}`, () => {
    it('should update value when onChange is called', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onChange('newValue');

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'newValue',
      });
    });

    it('should not change when onStart is called', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onStart();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.EDITING,
        value: 'stateValue',
      });
    });

    it(`should transition to ${states.PRESENTING} when onSubmit is called without promise`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => {}} />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.PRESENTING,
        value: 'propsValue',
      });
    });

    it(`should transition to ${states.COMMITTING} when onSubmit is called with promise`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
      wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: states.COMMITTING,
        value: 'stateValue',
      });
    });
  });

  describe(`when status is ${states.COMMITTING}`, () => {
    it(`should transition to ${states.PRESENTING} when promise resolves`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
      return wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        .then(() =>
          expect(
            wrapper.find(MockComponent).props()
          ).to.include({
            status: states.PRESENTING,
            value: 'propsValue',
          })
        );
    });

    it(`should transition to ${states.PRESENTING} when promise rejects`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.reject()} />);
      return wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        .then(() =>
          expect(
            wrapper.find(MockComponent).props()
          ).to.include({
            status: states.EDITING,
            value: 'stateValue',
          })
        );
    });

    it('rejected promise shouldn\'t reach setState when unmounted', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.reject()} />);
      const instance = wrapper.instance();
      const promise = wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        // setState shouldn't be called after this point
        .then(() => expect(instance.setState).to.not.have.been.called);

      sinon.spy(instance, 'setState');
      wrapper.unmount();
      return promise;
    });

    it('resolved promise shouldn\'t reach setState when unmounted', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
      const instance = wrapper.instance();
      const promise = wrapper
        .setState({
          status: states.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        // setState shouldn't be called after this point
        .then(() => expect(instance.setState).to.not.have.been.called);

      sinon.spy(instance, 'setState');
      wrapper.unmount();
      return promise;
    });
  });
});
