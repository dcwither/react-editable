import * as React from "react";

import Editable, { EditableChildProps, EditableStatus } from "./editable";

import { shallow } from "enzyme";
import MockComponent from "./__mocks__/mock-component";

const MockComponentWrapper = <TValue, TCommitType>(
  editableProps: EditableChildProps<TValue, TCommitType>
) => <MockComponent {...editableProps} />;

const PROPS_VALUE = "propsValue";
const STATE_VALUE = "stateValue";
const NEW_VALUE = "newValue";
const COMMIT_PARAM = "commit";

const EDITING_STATE = {
  status: EditableStatus.EDITING,
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
    <Editable {...props}>{MockComponentWrapper}</Editable>
  );
  const maybePromise = wrapper
    .setState(initialState)
    .find(MockComponent)
    .props()
    [event](...eventArgs);

  if (maybePromise && maybePromise.then) {
    maybePromise.then((result: any) => {
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
      expect(() =>
        shallow(<Editable value={undefined}>{() => null}</Editable>)
      ).not.toThrow();
    });

    test("should render MockComponent", () => {
      expect(
        shallow(<Editable value={undefined} children={MockComponentWrapper} />)
      ).toMatchSnapshot();
    });
  });

  describe(`when status is PRESENTING`, () => {
    test(`should transition to EDITING when onStart is called`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onStart"
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.EDITING,
        value: PROPS_VALUE
      });
    });

    test(`should transition to EDITING when onChange is called`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onChange",
        eventArgs: [NEW_VALUE]
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.EDITING,
        value: NEW_VALUE
      });
    });

    test("should be able to commit", () => {
      const commitSpy = jest.fn();

      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialProps: {
          onCommit: commitSpy
        }
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.PRESENTING,
        value: PROPS_VALUE
      });

      expect(commitSpy).toHaveBeenCalledWith(COMMIT_PARAM, PROPS_VALUE);
    });
  });

  describe(`when status is EDITING`, () => {
    test("should not change state when onStart is called", () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onStart",
        initialState: EDITING_STATE
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.EDITING,
        value: STATE_VALUE
      });
    });

    test("should update value when onChange is called", () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onChange",
        eventArgs: [NEW_VALUE],
        initialState: EDITING_STATE
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.EDITING,
        value: NEW_VALUE
      });
    });

    test(`should transition to PRESENTING when onCancel is called`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onCancel",
        initialState: EDITING_STATE
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.PRESENTING,
        value: PROPS_VALUE
      });
    });

    test("should call onCancel prop when cancelling", () => {
      const cancelSpy = jest.fn();
      createComponentWithStateAndTriggerEvent({
        event: "onCancel",
        initialProps: { onCancel: cancelSpy },
        initialState: EDITING_STATE
      });

      expect(cancelSpy).toHaveBeenCalledWith("stateValue");
    });

    test(`should transition to PRESENTING when onCommit is called without an event handler`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialState: EDITING_STATE
      });
      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.PRESENTING,
        value: PROPS_VALUE
      });
    });

    test(`should transition to PRESENTING when onCommit is called without promise`, () => {
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialState: EDITING_STATE
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.PRESENTING,
        value: PROPS_VALUE
      });
    });

    test(`should transition to COMMITING when onCommit is called with promise`, () => {
      const commitSpy = jest.fn().mockResolvedValue(null);
      const { wrapper } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialProps: { onCommit: commitSpy },
        initialState: EDITING_STATE
      });

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.COMMITTING,
        value: STATE_VALUE
      });
      expect(commitSpy).toHaveBeenCalledWith(COMMIT_PARAM, STATE_VALUE);
    });
  });

  describe(`when status is COMMITING`, () => {
    test("should throw when handleCommit is called", () => {
      expect(() =>
        createComponentWithStateAndTriggerEvent({
          event: "onCommit",
          eventArgs: [COMMIT_PARAM],
          initialState: {
            status: EditableStatus.COMMITTING,
            value: STATE_VALUE
          }
        })
      ).toThrow();
    });

    test(`should transition to PRESENTING when promise resolves`, async () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialProps: { onCommit: () => Promise.resolve() },
        initialState: EDITING_STATE
      });

      await promise;

      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.PRESENTING,
        value: PROPS_VALUE
      });
    });

    test(`should transition to PRESENTING when promise rejects`, async () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialProps: { onCommit: () => Promise.reject("failure reason") },
        initialState: EDITING_STATE
      });

      await promise;
      expect(wrapper.find(MockComponent).props()).toMatchObject({
        status: EditableStatus.EDITING,
        value: STATE_VALUE
      });
    });

    test("rejected promise shouldn't reach setState when unmounted", async () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialProps: { onCommit: () => Promise.reject("failure reason") },
        initialState: EDITING_STATE
      });
      const instance = wrapper.instance();
      jest.spyOn(instance, "setState");
      wrapper.unmount();

      await promise;
      expect(instance.setState).not.toHaveBeenCalled();
    });

    test("resolved promise shouldn't reach setState when unmounted", async () => {
      const { wrapper, promise } = createComponentWithStateAndTriggerEvent({
        event: "onCommit",
        eventArgs: [COMMIT_PARAM],
        initialProps: { onCommit: () => Promise.resolve() },
        initialState: EDITING_STATE
      });
      const instance = wrapper.instance();
      jest.spyOn(instance, "setState");
      wrapper.unmount();

      await promise;
      expect(instance.setState).not.toHaveBeenCalled();
    });
  });
});
