# React Editable

An HOC that wraps around a stateless form component to provide an editing state that it maintains. Works with promises returned by the Editable methods.


## Event Handlers (`onSubmit`, `onUpdate`, `onDelete`)

These will be called when the matching methods passed through to the stateless child are called.

If they return a promise, ReactEditable will remain in a `COMITTING` state until the promise resolves.

If ReactEditable unmounts before the promise resolves, it will cancel its promise, and avoid a setState.
