import { act, renderHook } from "@testing-library/react-hooks";

import useEditable from "./use-editable";

describe("useEditable", () => {
  it("will ignore input value changes while editing ", () => {
    const { result, rerender } = renderHook(props => useEditable(props), {
      initialProps: { value: "INITIAL_VALUE" }
    });

    act(() => {
      result.current.onStart();
    });

    rerender({ value: "RERENDER_VALUE" });

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

  describe("TEST INTERNAL BEHAVIOR perf", () => {
    it("will memoize results based on same state ", () => {
      const { result, rerender } = renderHook(() =>
        useEditable({ value: "INITIAL_VALUE" })
      );

      const initial = result.current;

      rerender();

      expect(result.current).toBe(initial);
    });

    it("will memoize some callbacks based on input value", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useEditable({ value }),
        { initialProps: { value: "INITIAL_VALUE" } }
      );

      const initial = result.current;

      rerender({ value: "RERENDER_VALUE" });

      expect(result.current.onStart).not.toBe(initial.onStart);
      expect(result.current.onChange).toBe(initial.onChange);
      expect(result.current.onCancel).toBe(initial.onCancel);
      expect(result.current.onCommit).not.toBe(initial.onCommit);
    });

    it("will memoize some callbacks based on onCommit", () => {
      const { result, rerender } = renderHook(props => useEditable(props), {
        initialProps: { value: "INITIAL_VALUE", onCommit: () => null }
      });

      const initial = result.current;

      rerender({ value: "INITIAL_VALUE", onCommit: () => null });

      expect(result.current.onStart).toBe(initial.onStart);
      expect(result.current.onChange).toBe(initial.onChange);
      expect(result.current.onCancel).toBe(initial.onCancel);
      expect(result.current.onCommit).not.toBe(initial.onCommit);
    });

    it("will memoize some callbacks based on onCancel", () => {
      const { result, rerender } = renderHook(props => useEditable(props), {
        initialProps: { value: "INITIAL_VALUE", onCancel: () => null }
      });

      const initial = result.current;

      rerender({ value: "INITIAL_VALUE", onCancel: () => null });

      expect(result.current.onStart).toBe(initial.onStart);
      expect(result.current.onChange).toBe(initial.onChange);
      expect(result.current.onCancel).not.toBe(initial.onCancel);
      expect(result.current.onCommit).toBe(initial.onCommit);
    });
  });
});
