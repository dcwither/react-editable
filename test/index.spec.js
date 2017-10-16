import withEditable, {EditableState} from '../src/index';

import PropTypes from 'prop-types';
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';

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
      status: EditableState.PRESENTING,
    }).and.to.have.all.keys([
      'onStart',
      'onCancel',
      'onChange',
      'onSubmit',
      'onUpdate',
      'onDelete',
    ]);
  });

  describe(`when status is ${EditableState.PRESENTING}`, () => {
    it(`should transition to ${EditableState.EDITING} when onStart is called`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper.find(MockComponent).props().onStart();
      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.EDITING,
        value: 'propsValue',
      });
    });

    it(`should transition to ${EditableState.EDITING} when onChange is called`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper.find(MockComponent).props().onChange('newValue');
      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.EDITING,
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

  describe(`when status is ${EditableState.EDITING}`, () => {
    it('should not change when onStart is called', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onStart();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.EDITING,
        value: 'stateValue',
      });
    });

    it('should update value when onChange is called', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onChange('newValue');

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.EDITING,
        value: 'newValue',
      });
    });

    it(`should transition to ${EditableState.PRESENTING} when onCancel is called`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onCancel();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.PRESENTING,
        value: 'propsValue',
      });
    });

    it('should call onCancel prop when cancelling', () => {
      const cancelSpy = sinon.spy();
      const wrapper = shallow(<EditableMockComponent value='propsValue' onCancel={cancelSpy} />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onCancel();

      expect(cancelSpy).to.have.been.calledWith('stateValue');
    });

    it(`should transition to ${EditableState.PRESENTING} when onCancel is called`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onCancel();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.PRESENTING,
        value: 'propsValue',
      });
    });

    it(`should transition to ${EditableState.PRESENTING} when onSubmit is called without promise`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => {}} />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.PRESENTING,
        value: 'propsValue',
      });
    });

    it(`should transition to ${EditableState.COMMITTING} when onSubmit is called with promise`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit();

      expect(
        wrapper.find(MockComponent).props()
      ).to.include({
        status: EditableState.COMMITTING,
        value: 'stateValue',
      });
    });
  });

  describe(`when status is ${EditableState.COMMITTING}`, () => {
    it('should throw when handleCommit is called', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      return expect(
        wrapper
          .setState({
            status: EditableState.COMMITTING,
            value: 'stateValue',
          })
          .find(MockComponent)
          .props()
          .onSubmit
      ).to.throw('React Editable cannot commit while commiting');
    });

    it(`should transition to ${EditableState.PRESENTING} when promise resolves`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
      return wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        .then(() =>
          expect(
            wrapper.find(MockComponent).props()
          ).to.include({
            status: EditableState.PRESENTING,
            value: 'propsValue',
          })
        );
    });

    it(`should transition to ${EditableState.PRESENTING} when promise rejects`, () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.reject()} />);
      return wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onSubmit()
        .then(() =>
          expect(
            wrapper.find(MockComponent).props()
          ).to.include({
            status: EditableState.EDITING,
            value: 'stateValue',
          })
        );
    });

    it('rejected promise shouldn\'t reach setState when unmounted', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.reject()} />);
      const instance = wrapper.instance();
      const promise = wrapper
        .setState({
          status: EditableState.EDITING,
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
          status: EditableState.EDITING,
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
