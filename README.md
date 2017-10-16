# React Editable

An HOC that wraps around a form component to provide an editing state that it maintains. Works with promises returned by the Editable methods.

React Editable can accept anything as its value, making it a generic wrapper for any form that needs a temporary editing state.

## Usage

```js
import withEditable, {EditableState, EditableStateType} from 'react-editable-decorator';

@withEditable
class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    status: EditableStateType.isRequired,
    value: PropTypes.string.isRequired
  }

  handleChange = (evt) => {
    this.props.onChange(evt.target.value);
  }

  render() {
    const {status, value} = this.props;
    return <input
      className='input'
      disabled={status === EditableState.COMMITTING}
      onChange={this.handleChange}
      value={value}
    />;
  }
}
```

## Properties


Property   | Type                  | Required | Description
-----------|-----------------------|----------|--------------------------------------------------------------
`onCancel` | func(value)           | No       | Callback for when editing is canceled
`onDelete` | func(value)           | No       | Callback for deletion
`onSubmit` | func(value)           | No       | Callback for submission
`onUpdate` | func(value)           | No       | Callback for update
`value`    | child.propTypes.value | No       | Unedited value to be passed through to child while presenting

## Child Properties

Property   | Type                                     | Description
-----------|------------------------------------------|--------------------------------------------------------------
`onStart`  | func                                     | Callback that triggers start of editing
`onCancel` | func                                     | Callback that triggers cancel editing and clears edited value
`onChange` | func(nextValue)                          | Callback that triggers change in edited value
`onSubmit` | func                                     | Callback that triggers submission
`onUpdate` | func                                     | Callback that triggers update
`onDelete` | func                                     | Callback that triggers deletion
`status`   | 'PRESENTING', 'EDITING', or 'COMMITTING' | Current status of ReactEditable
`value`    | any                                      | Value of ReactEditable

## Commit Event Handlers (`onSubmit`, `onUpdate`, `onDelete`)

These will be called when the matching callbacks passed through to the child are called.

If they return a promise, ReactEditable will remain in a `COMITTING` state until the promise resolves.

If ReactEditable unmounts before the promise resolves, it will cancel its promise, and avoid a setState.
