import withEditable from "./with-editable";

import * as React from "react";
import { mount } from "enzyme";
import MockComponent from "./__mocks__/mock-component";

const MockComponentWithEditable = withEditable(MockComponent);

describe("withEditable", () => {
  test("should create the correct displayName", () => {
    expect(MockComponentWithEditable.displayName).toBe(
      "WithEditable(MockComponent)"
    );

    let ComponentWithName = () => {};
    expect(withEditable(ComponentWithName).displayName).toBe(
      "WithEditable(ComponentWithName)"
    );

    expect(withEditable(() => {}).displayName).toBe("WithEditable(Component)");
  });

  test("shouldn't fatal", () => {
    expect(() => <MockComponentWithEditable testProp={1} />).not.toThrow();
  });

  test("should hoist MockComponent props", () => {
    expect(MockComponentWithEditable.propTypes).toHaveProperty("testProp");
  });

  test("should match snapshot", () => {
    expect(mount(<MockComponentWithEditable testProp={1} />)).toMatchSnapshot();
  });
});
