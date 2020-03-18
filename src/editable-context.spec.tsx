// tslint:disable jsx-no-lambda
import { fireEvent, getByTestId, render } from "@testing-library/react";
import React from "react";
import { Editable, useEditableContext } from "./editable-context";

function TestHarness() {
  const { value, onChange, onCommit, onCancel, status } = useEditableContext<
    string,
    string
  >();
  return (
    <div>
      <div data-testid="form">
        <p>{status}</p>
        <input
          data-testid="input"
          value={value}
          onChange={({ target: { value: nextValue } }) => onChange(nextValue)}
        />
      </div>
      <button onClick={() => onCommit("SUBMIT")}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={() => onCommit("DELETE")}>Delete</button>
    </div>
  );
}

describe("Editable Context", () => {
  it("renders the harness", () => {
    const { container } = render(
      <Editable value="INITIAL_VALUE">
        <TestHarness />
      </Editable>
    );
    expect(getByTestId(container, "form")).toMatchInlineSnapshot(`
      <div
        data-testid="form"
      >
        <p>
          PRESENTING
        </p>
        <input
          data-testid="input"
          value="INITIAL_VALUE"
        />
      </div>
    `);
  });

  it("renders the updated values after change", () => {
    const { container } = render(
      <Editable value="INITIAL_VALUE">
        <TestHarness />
      </Editable>
    );

    fireEvent.change(getByTestId(container, "input"), {
      target: { value: "NEW_VALUE" }
    });
    expect(getByTestId(container, "form")).toMatchInlineSnapshot(`
      <div
        data-testid="form"
      >
        <p>
          EDITING
        </p>
        <input
          data-testid="input"
          value="NEW_VALUE"
        />
      </div>
    `);
  });
});
