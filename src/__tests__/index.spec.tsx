import withEditable, { EditableState } from "../index";

import PropTypes from "prop-types";
import React from "react";
import { shallow } from "enzyme";

class MockComponent extends React.PureComponent {
  static propTypes = {
    testProp: PropTypes.number
  };

  render() {
    return <div />;
  }
}

const EditableMockComponent = withEditable(MockComponent);
const PROPS_VALUE = "propsValue";
const STATE_VALUE = "stateValue";
const NEW_VALUE = "newValue";

const EDITING_STATE = {
  status: EditableState.EDITING,
  value: STATE_VALUE
};

function createComponentWithStateAndTriggerEvent({
  initialProps,
  initialState,
  event,
  eventArgs = []
}) {
  const props = {
    value: PROPS_VALUE,
    ...initialProps
  };
  const wrapper = shallow(<EditableMockComponent {...props} />);
  const maybePromise = wrapper
    .setState(initialState)
    .find(MockComponent)
    .props()
    [event](...eventArgs);

  if (maybePromise && maybePromise.then) {
    maybePromise.then(result => {
      wrapper.update();
      return result;
    });
  }
  wrapper.update();

  return { wrapper, promise: maybePromise };
}

describe("withEditable", () => {
  describe("smoke tests", () => {
    test("should create the correct displayName", () => {
      expect(EditableMockComponent.displayName).toBe(
        "WithEditable(MockComponent)"
      );

      let ComponentWithName = () => {};
      expect(withEditable(ComponentWithName).displayName).toBe(
        "WithEditable(ComponentWithName)"
      );

      expect(withEditable(() => {}).displayName).toBe(
        "WithEditable(Component)"
      );
    });

    test("shouldn't fatal", () => {
      expect(() => <EditableMockComponent />).not.toThrow();
    });

    test("should render MockComponent", () => {
      expect(shallow(<EditableMockComponent />).is(MockComponent)).toBe(true);
    });

    test("should hoist MockComponent props", () => {
      expect(EditableMockComponent.propTypes).toHaveProperty("testProp");
    });

    test("should pass through props to MockComponent", () => {
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
        onDelete: expect.any(Function)
      });
    });
  });

  describe(`when status is ${EditableState.PRESENTING}`, () => {
    test(`should transition to ${
      EditableState.EDITING
    } when onStart is called`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onStart"
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.EDITING,
        value: "propsValue"
      });
    });

    test(`should transition to ${
      EditableState.EDITING
    } when onChange is called`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onChange",
        eventArgs: [NEW_VALUE]
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.EDITING,
        value: NEW_VALUE
      });
    });

    test("should be able to delete", () => {
      const deleteSpy = jest.fn();
      createComponentWithStateAndTriggerEvent({
        initialProps: { onDelete: deleteSpy },
        event: "onDelete"
      });

      expect(deleteSpy).toHaveBeenCalledWith("propsValue");
    });
  });

  describe(`when status is ${EditableState.EDITING}`, () => {
    test("should not change state when onStart is called", () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialState: EDITING_STATE,
        event: "onStart"
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.EDITING,
        value: "stateValue"
      });
    });

    test("should update value when onChange is called", () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialState: EDITING_STATE,
        event: "onChange",
        eventArgs: [NEW_VALUE]
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.EDITING,
        value: NEW_VALUE
      });
    });

    test(`should transition to ${
      EditableState.PRESENTING
    } when onCancel is called`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialState: EDITING_STATE,
        event: "onCancel"
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.PRESENTING,
        value: "propsValue"
      });
    });

    test("should call onCancel prop when cancelling", () => {
      const cancelSpy = jest.fn();
      createComponentWithStateAndTriggerEvent({
        initialProps: { onCancel: cancelSpy },
        initialState: EDITING_STATE,
        event: "onCancel"
      });

      expect(cancelSpy).toHaveBeenCalledWith("stateValue");
    });

    test(`should transition to ${
      EditableState.PRESENTING
    } when onSubmit is called without an event handler`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialState: EDITING_STATE,
        event: "onSubmit"
      });
      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.PRESENTING,
        value: "propsValue"
      });
    });

    test(`should transition to ${
      EditableState.PRESENTING
    } when onSubmit is called without promise`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialProps: { onSubmit: () => {} },
        initialState: EDITING_STATE,
        event: "onSubmit"
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.PRESENTING,
        value: "propsValue"
      });
    });

    test(`should transition to ${
      EditableState.COMMITTING
    } when onUpdate is called with promise`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialProps: { onUpdate: () => Promise.resolve() },
        initialState: EDITING_STATE,
        event: "onUpdate"
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.COMMITTING,
        value: "stateValue"
      });
    });
  });

  describe(`when status is ${EditableState.COMMITTING}`, () => {
    test("should throw when handleCommit is called", () => {
      expect(() =>
        createComponentWithStateAndTriggerEvent({
          initialState: {
            status: EditableState.COMMITTING,
            value: "stateValue"
          },
          event: "onSubmit"
        })
      ).toThrow("React Editable cannot commit while commiting");
    });

    test(`should transition to ${
      EditableState.PRESENTING
    } when promise resolves`, () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        initialProps: { onSubmit: () => Promise.resolve() },
        initialState: EDITING_STATE,
        event: "onSubmit"
      });
      promise.then(() => {
        expect(wrapper.find(MockComponent).props()).toMatchObject({
          status: EditableState.PRESENTING,
          value: "propsValue"
        });
      });
    });

    test(`should transition to ${
      EditableState.PRESENTING
    } when promise rejects`, () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        initialProps: { onSubmit: () => Promise.reject() },
        initialState: EDITING_STATE,
        event: "onSubmit"
      });
      promise.then(() => {
        expect(wrapper.find(MockComponent).props()).toMatchObject({
          status: EditableState.EDITING,
          value: "stateValue"
        });
      });
    });

    test("rejected promise shouldn't reach setState when unmounted", () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        initialProps: { onSubmit: () => Promise.reject() },
        initialState: EDITING_STATE,
        event: "onSubmit"
      });
      const instance = wrapper.instance();
      jest.spyOn(instance, "setState");
      wrapper.unmount();

      promise.then(() => expect(instance.setState).not.toHaveBeenCalled());
      return promise;
    });

    test("resolved promise shouldn't reach setState when unmounted", () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        initialProps: { onSubmit: () => Promise.resolve() },
        initialState: EDITING_STATE,
        event: "onSubmit"
      });
      const instance = wrapper.instance();
      jest.spyOn(instance, "setState");
      wrapper.unmount();

      promise.then(() => expect(instance.setState).not.toHaveBeenCalled());
      return promise;
    });
  });
});
