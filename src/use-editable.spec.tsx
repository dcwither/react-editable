import { act, renderHook } from "@testing-library/react-hooks";
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

  it("should switch to EDITING onChange", () => {
    const { result } = renderHook(() =>
      useEditable({ value: "INITIAL_VALUE" })
    );
    act(() => {
      result.current.onStart();
    });
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "onCancel": [Function],
        "onChange": [Function],
        "onCommit": [Function],
        "onStart": [Function],
        "status": "EDITING",
        "value": "INITIAL_VALUE",
      }
    `);
  });

  it("should switch to EDITING with NEW_VALUE onChange", () => {
    const { result } = renderHook(() =>
      useEditable({ value: "INITIAL_VALUE" })
    );
    act(() => {
      result.current.onChange("NEW_VALUE");
    });
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "onCancel": [Function],
        "onChange": [Function],
        "onCommit": [Function],
        "onStart": [Function],
        "status": "EDITING",
        "value": "NEW_VALUE",
      }
    `);
  });

  it("should reset state onCancel", () => {
    const onCancel = jest.fn();
    const { result } = renderHook(() =>
      useEditable({ value: "INITIAL_VALUE", onCancel })
    );
    act(() => {
      result.current.onChange("NEW_VALUE");
    });
    act(() => {
      result.current.onCancel();
    });

    expect(onCancel).toHaveBeenCalledWith("NEW_VALUE");
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

  describe("when onCommit is synchronous", () => {
    it("should call onCommit with NEW_VALUE onCommit and reset state", () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE", onCommit })
      );
      act(() => {
        result.current.onChange("NEW_VALUE");
      });
      act(() => {
        result.current.onCommit("SUBMIT", result.current.value);
      });

      expect(onCommit).toHaveBeenCalledWith("SUBMIT", "NEW_VALUE");
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

  describe("when onCommit returns a Promise", () => {
    it("should call onCommit with NEW_VALUE onCommit and reset state after promise resolves", async () => {
      const promise = Promise.resolve();
      const onCommit = jest.fn(() => promise);
      const { result } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE", onCommit })
      );
      act(() => {
        result.current.onChange("NEW_VALUE");
      });
      act(() => {
        result.current.onCommit("SUBMIT", result.current.value);
      });

      expect(onCommit).toHaveBeenCalledWith("SUBMIT", "NEW_VALUE");
      expect(result.current).toMatchInlineSnapshot(`
        Object {
          "onCancel": [Function],
          "onChange": [Function],
          "onCommit": [Function],
          "onStart": [Function],
          "status": "COMMITTING",
          "value": "NEW_VALUE",
        }
      `);
      await act(async () => {
        await promise;
      });
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
});
