# React Editable [![Build Status](https://travis-ci.org/dcwither/react-editable-decorator.svg?branch=master)](https://travis-ci.org/dcwither/react-editable-decorator) [![Coverage Status](https://coveralls.io/repos/github/dcwither/react-editable-decorator/badge.svg?branch=master)](https://coveralls.io/github/dcwither/react-editable-decorator?branch=master) [![dependencies Status](https://david-dm.org/dcwither/react-editable-decorator/status.svg)](https://david-dm.org/dcwither/react-editable-decorator)

An HOC that wraps around a form component to provide an editing state that it maintains. Works with promises returned by the Editable methods.

React Editable can accept anything as its value, making it a generic wrapper for any form that needs a temporary editing state.

## Demo & Examples

Live demo: https://dcwither.github.io/react-editable-decorator/

```
npm install
npm run storybook
```

Then open [`localhost:6006`](http://localhost:6006) in a browser

## Usage

```js
import withEditable, {
  EditableState,
  EditableStateType
} from "react-editable-decorator";

@withEditable
class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: EditableStateType.isRequired,
    value: PropTypes.string.isRequired
  };

  handleChange = evt => {
    this.props.onChange(evt.target.value);
  };

  render() {
    const { status, value } = this.props;
    return (
      <input
        className="input"
        disabled={status === EditableState.COMMITTING}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}
```

## Properties

| Property   | Type                  | Required | Description                                                   |
| ---------- | --------------------- | -------- | ------------------------------------------------------------- |
| `onCancel` | func(value)           | No       | Callback for when editing is canceled                         |
| `onCommit` | func(message, value)  | No       | Callback for commit changes                                   |
| `value`    | child.propTypes.value | No       | Unedited value to be passed through to child while presenting |

## Child Properties

| Property   | Type                                     | Description                                                   |
| ---------- | ---------------------------------------- | ------------------------------------------------------------- |
| `onStart`  | func                                     | Callback that triggers start of editing                       |
| `onCancel` | func                                     | Callback that triggers cancel editing and clears edited value |
| `onChange` | func(nextValue)                          | Callback that triggers change in edited value                 |
| `onCommit` | func(message)                            | Callback that triggers a commit                               |
| `status`   | 'PRESENTING', 'EDITING', or 'COMMITTING' | Current status of ReactEditable                               |
| `value`    | any                                      | Value of ReactEditable                                        |

## Commit Event Handler (`onCommit`)

This will be called when the matching callback passed through to the render prop child is called.

If it returns a promise, ReactEditable will remain in a `COMITTING` state until the promise resolves.

If ReactEditable unmounts before the promise resolves, it will cancel its promise, and avoid a setState.
