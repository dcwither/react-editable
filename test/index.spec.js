import withEditable, {EditableState} from '../src/index';

import PropTypes from 'prop-types';
import React from 'react';
import {shallow} from 'enzyme';

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
    test('shouldn\'t fatal', () => {
      expect(() => <EditableMockComponent />).not.toThrow();
    });

    test('should render MockComponent', () => {
      expect(shallow(<EditableMockComponent />).is(MockComponent)).toBe(true);
    });
  });

  test('should hoist MockComponent props', () => {
    expect(EditableMockComponent.propTypes).toHaveProperty('testProp');
  });

  test('should pass through props to MockComponent', () => {
    expect(
      shallow(<EditableMockComponent testProp={1} />)
        .find(MockComponent)
        .props()
    ).toMatchObject({
      testProp: 1,
      value: undefined,
      status: EditableState.PRESENTING,
      onStart: expect.any(Function),
      onCancel: expect.any(Function),
      onChange: expect.any(Function),
      onSubmit: expect.any(Function),
      onUpdate: expect.any(Function),
      onDelete: expect.any(Function),
    });
  });

  describe(`when status is ${EditableState.PRESENTING}`, () => {
    test(
      `should transition to ${EditableState.EDITING} when onStart is called`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' />);
        wrapper
          .find(MockComponent)
          .props()
          .onStart();
        wrapper.update();

        expect(
          wrapper.find(MockComponent).props()
        ).toMatchObject({
          status: EditableState.EDITING,
          value: 'propsValue',
        });
      }
    );

    test(
      `should transition to ${EditableState.EDITING} when onChange is called`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' />);
        wrapper
          .find(MockComponent)
          .props()
          .onChange('newValue');
        wrapper.update();

        expect(
          wrapper.find(MockComponent).props()
        ).toMatchObject({
          status: EditableState.EDITING,
          value: 'newValue',
        });
      }
    );

    test('should be able to delete', () => {
      const deleteSpy = jest.fn();
      const wrapper = shallow(<EditableMockComponent value='propsValue' onDelete={deleteSpy} />);
      wrapper
        .find(MockComponent)
        .props()
        .onDelete();
      wrapper.update();
      expect(deleteSpy).toHaveBeenCalledWith('propsValue');
    });
  });

  describe(`when status is ${EditableState.EDITING}`, () => {
    test('should not change when onStart is called', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onStart();
      wrapper.update();

      expect(
        wrapper.find(MockComponent).props()
      ).toMatchObject({
        status: EditableState.EDITING,
        value: 'stateValue',
      });
    });

    test('should update value when onChange is called', () => {
      const wrapper = shallow(<EditableMockComponent value='propsValue' />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onChange('newValue');
      wrapper.update();

      expect(
        wrapper.find(MockComponent).props()
      ).toMatchObject({
        status: EditableState.EDITING,
        value: 'newValue',
      });
    });

    test(
      `should transition to ${EditableState.PRESENTING} when onCancel is called`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' />);
        wrapper
          .setState({
            status: EditableState.EDITING,
            value: 'stateValue',
          })
          .find(MockComponent)
          .props()
          .onCancel();
        wrapper.update();

        expect(
          wrapper.find(MockComponent).props()
        ).toMatchObject({
          status: EditableState.PRESENTING,
          value: 'propsValue',
        });
      }
    );

    test('should call onCancel prop when cancelling', () => {
      const cancelSpy = jest.fn();
      const wrapper = shallow(<EditableMockComponent value='propsValue' onCancel={cancelSpy} />);
      wrapper
        .setState({
          status: EditableState.EDITING,
          value: 'stateValue',
        })
        .find(MockComponent)
        .props()
        .onCancel();

      expect(cancelSpy).toHaveBeenCalledWith('stateValue');
    });

    test(
      `should transition to ${EditableState.PRESENTING} when onCancel is called`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' />);
        wrapper
          .setState({
            status: EditableState.EDITING,
            value: 'stateValue',
          })
          .find(MockComponent)
          .props()
          .onCancel();
        wrapper.update();

        expect(
          wrapper.find(MockComponent).props()
        ).toMatchObject({
          status: EditableState.PRESENTING,
          value: 'propsValue',
        });
      }
    );

    test(
      `should transition to ${EditableState.PRESENTING} when onSubmit is called without promise`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => {}} />);
        wrapper
          .setState({
            status: EditableState.EDITING,
            value: 'stateValue',
          })
          .find(MockComponent)
          .props()
          .onSubmit();
        wrapper.update();

        expect(
          wrapper.find(MockComponent).props()
        ).toMatchObject({
          status: EditableState.PRESENTING,
          value: 'propsValue',
        });
      }
    );

    test(
      `should transition to ${EditableState.COMMITTING} when onSubmit is called with promise`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
        wrapper
          .setState({
            status: EditableState.EDITING,
            value: 'stateValue',
          })
          .find(MockComponent)
          .props()
          .onSubmit();
        wrapper.update();

        expect(
          wrapper.find(MockComponent).props()
        ).toMatchObject({
          status: EditableState.COMMITTING,
          value: 'stateValue',
        });
      }
    );
  });

  describe(`when status is ${EditableState.COMMITTING}`, () => {
    test('should throw when handleCommit is called', () => {
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
      ).toThrow('React Editable cannot commit while commiting');
    });

    test(
      `should transition to ${EditableState.PRESENTING} when promise resolves`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.resolve()} />);
        return wrapper
          .setState({
            status: EditableState.EDITING,
            value: 'stateValue',
          })
          .find(MockComponent)
          .props()
          .onSubmit()
          .then(() => {
            wrapper.update();
            expect(
              wrapper.find(MockComponent).props()
            ).toMatchObject({
              status: EditableState.PRESENTING,
              value: 'propsValue',
            })
          });
      }
    );

    test(
      `should transition to ${EditableState.PRESENTING} when promise rejects`,
      () => {
        const wrapper = shallow(<EditableMockComponent value='propsValue' onSubmit={() => Promise.reject()} />);
        return wrapper
          .setState({
            status: EditableState.EDITING,
            value: 'stateValue',
          })
          .find(MockComponent)
          .props()
          .onSubmit()
          .then(() => {
            wrapper.update();
            expect(
              wrapper.find(MockComponent).props()
            ).toMatchObject({
              status: EditableState.EDITING,
              value: 'stateValue',
            })
          });
      }
    );

    test('rejected promise shouldn\'t reach setState when unmounted', () => {
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
        .then(() => expect(instance.setState).not.toHaveBeenCalled());

      jest.spyOn(instance, 'setState');
      wrapper.unmount();
      return promise;
    });

    test('resolved promise shouldn\'t reach setState when unmounted', () => {
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
        .then(() => expect(instance.setState).not.toHaveBeenCalled());

      jest.spyOn(instance, 'setState');
      wrapper.unmount();
      return promise;
    });
  });
});
