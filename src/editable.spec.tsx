import Editable, { EditableState } from "./editable";

import * as React from "react";
import { shallow } from "enzyme";
import MockComponent from "./__mocks__/mock-component";

const MockComponentWrapper = editableProps => (
  <MockComponent {...editableProps} />
);

const PROPS_VALUE = "propsValue";
const STATE_VALUE = "stateValue";
const NEW_VALUE = "newValue";
const COMMIT_PARAM = "commit";

const EDITING_STATE = {
  status: EditableState.EDITING,
  value: STATE_VALUE
};

function createComponentWithStateAndTriggerEvent({
  initialProps = {},
  initialState = {},
  event,
  eventArgs = []
}: {
  initialProps?: object;
  initialState?: object;
  event: string;
  eventArgs?: any[];
}) {
  const props = {
    value: PROPS_VALUE,
    ...initialProps
  };
  const wrapper = shallow(
    <Editable {...props} children={MockComponentWrapper} />
  );
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

describe("Editable", () => {
  describe("smoke tests", () => {
    test("shouldn't fatal", () => {
      expect(() => <Editable value={undefined} />).not.toThrow();
    });

    test("should render MockComponent", () => {
      expect(
        shallow(<Editable value={undefined} children={MockComponentWrapper} />)
      ).toMatchSnapshot();
    });
  });

  describe(`when status is ${EditableState.PRESENTING}`, () => {
    test(`should transition to ${
      EditableState.EDITING
    } when onStart is called`, () => {
      const wrapper = shallow(
        <Editable value={PROPS_VALUE}>{MockComponentWrapper}</Editable>
      );

      wrapper
        .find(MockComponent)
        .props()
        .onStart();

      expect(
        wrapper
          .update()
          .find(MockComponent)
          .props()
      ).toMatchObject({
        status: EditableState.EDITING,
        value: "propsValue"
      });
    });

    test(`should transition to ${
      EditableState.EDITING
    } when onChange is called`, () => {
      const wrapper = shallow(
        <Editable value={PROPS_VALUE}>{MockComponentWrapper}</Editable>
      );

      wrapper
        .find(MockComponent)
        .props()
        .onChange(NEW_VALUE);

      expect(
        wrapper
          .update()
          .find(MockComponent)
          .props()
      ).toMatchObject({
        status: EditableState.EDITING,
        value: NEW_VALUE
      });
    });

    test("should be able to commit", () => {
      const commitSpy = jest.fn();
      const wrapper = shallow(
        <Editable value={PROPS_VALUE} onCommit={commitSpy}>
          {MockComponentWrapper}
        </Editable>
      );

      wrapper
        .find(MockComponent)
        .props()
        .onCommit(COMMIT_PARAM);

      expect(commitSpy).toHaveBeenCalledWith(COMMIT_PARAM, PROPS_VALUE);

      expect(
        wrapper
          .update()
          .find(MockComponent)
          .props()
      ).toMatchObject({
        status: EditableState.PRESENTING,
        value: PROPS_VALUE
      });
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
        value: STATE_VALUE
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
    } when onCommit is called without an event handler`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialState: EDITING_STATE,
        event: "Submit"
      });
      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableState.PRESENTING,
        value: "propsValue"
      });
    });

    test(`should transition to ${
      EditableState.PRESENTING
    } when onCommit is called without promise`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        initialProps: { onCommit: () => {} },
        initialState: EDITING_STATE,
        event: "Submit"
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
        value: STATE_VALUE
      });
    });
  });

  describe(`when status is ${EditableState.COMMITTING}`, () => {
    test("should throw when handleCommit is called", () => {
      expect(() =>
        createComponentWithStateAndTriggerEvent({
          initialState: {
            status: EditableState.COMMITTING,
            value: STATE_VALUE
          },
          event: "Submit"
        })
      ).toThrow();
    });

    test(`should transition to ${
      EditableState.PRESENTING
    } when promise resolves`, () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        initialProps: { onCommit: () => Promise.resolve() },
        initialState: EDITING_STATE,
        event: "Submit"
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
        initialProps: { onCommit: () => Promise.reject("failure reason") },
        initialState: EDITING_STATE,
        event: "Submit"
      });
      promise.then(() => {
        expect(wrapper.find(MockComponent).props()).toMatchObject({
          status: EditableState.EDITING,
          value: STATE_VALUE
        });
      });
    });

    test("rejected promise shouldn't reach setState when unmounted", () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        initialProps: { onCommit: () => Promise.reject("failure reason") },
        initialState: EDITING_STATE,
        event: "Submit"
      });
      const instance = wrapper.instance();
      jest.spyOn(instance, "setState");
      wrapper.unmount();

      promise.then(() => expect(instance.setState).not.toHaveBeenCalled());
      return promise;
    });

    test("resolved promise shouldn't reach setState when unmounted", () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        initialProps: { onCommit: () => Promise.resolve() },
        initialState: EDITING_STATE,
        event: "Submit"
      });
      const instance = wrapper.instance();
      jest.spyOn(instance, "setState");
      wrapper.unmount();

      promise.then(() => expect(instance.setState).not.toHaveBeenCalled());
      return promise;
    });
  });
});
