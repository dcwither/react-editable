import { act, renderHook } from "@testing-library/react-hooks";
import useEditable from "./use-editable";

describe("useEditable", () => {
  it("will have be PRESENTING on initialization", () => {
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

  it("should return to PRESENTING onCancel", () => {
    const handleCancel = jest.fn();
    const { result } = renderHook(() =>
      useEditable({ value: "INITIAL_VALUE", onCancel: handleCancel })
    );
    act(() => {
      result.current.onChange("NEW_VALUE");
    });
    act(() => {
      result.current.onCancel();
    });

    expect(handleCancel).toHaveBeenCalledWith("NEW_VALUE");
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
      const handleCommit = jest.fn();
      const { result } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE", onCommit: handleCommit })
      );
      act(() => {
        result.current.onChange("NEW_VALUE");
      });
      act(() => {
        result.current.onCommit("SUBMIT");
      });

      expect(handleCommit).toHaveBeenCalledWith("SUBMIT", "NEW_VALUE");
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
    it("should call onCommit with NEW_VALUE onCommit and return to PRESENTING after promise resolves", async () => {
      const promise = Promise.resolve();
      const handeCommit = jest.fn(() => promise);
      const { result } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE", onCommit: handeCommit })
      );
      act(() => {
        result.current.onChange("NEW_VALUE");
      });
      act(() => {
        result.current.onCommit("SUBMIT");
      });

      expect(handeCommit).toHaveBeenCalledWith("SUBMIT", "NEW_VALUE");
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
    it("should throw error when onCommit is called while COMMITTING", async () => {
      // Something goes here
      const promise = Promise.resolve();
      const handleCommit = jest.fn(() => promise);
      const { result } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE", onCommit: handleCommit })
      );
      act(() => {
        result.current.onChange("NEW_VALUE");
      });
      act(() => {
        result.current.onCommit("SUBMIT");
      });

      expect(() =>
        act(() => {
          result.current.onCommit("SUBMIT");
        })
      ).toThrowErrorMatchingInlineSnapshot(
        `"React Editable cannot commit while commiting"`
      );
      await act(async () => {
        await promise;
      });
    });
    it("should return to editing on promise failure", async () => {
      const promise = Promise.reject();
      const handleCommit = jest.fn(() => promise);
      const { result } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE", onCommit: handleCommit })
      );
      act(() => {
        result.current.onChange("NEW_VALUE");
      });
      act(() => {
        result.current.onCommit("SUBMIT");
      });

      expect(handleCommit).toHaveBeenCalledWith("SUBMIT", "NEW_VALUE");
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
        await promise.catch(() => null);
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
    it("should cancel the update on unmount", async () => {
      // Something goes here
      const promise = Promise.resolve();
      const handleCommit = jest.fn(() => promise);
      const { result, unmount } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE", onCommit: handleCommit })
      );
      act(() => {
        result.current.onChange("NEW_VALUE");
      });
      act(() => {
        result.current.onCommit("SUBMIT");
      });

      expect(handleCommit).toHaveBeenCalledWith("SUBMIT", "NEW_VALUE");
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
      unmount();
      await act(async () => {
        await promise;
      });
      // Result remains in commiting state despite promise being competed
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
    });
  });
});
