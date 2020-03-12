import { renderHook } from "@testing-library/react-hooks";
import useEditable from "./use-editable";

describe("useEditable", () => {
  it("will have the value as the initial state", () => {
    const { result } = renderHook(() =>
      useEditable({ value: "INITIAL_VALUE" })
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "onCancel": [Function],
        "onChange": [Function],
        "onCommit": [Function],
        "onStart": [Function],
        "status": "PRESENTING",
        "value": "INITIAL_VALUE",
      }
    `);
  });
});
