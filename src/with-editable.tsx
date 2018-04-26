import * as PropTypes from "prop-types";
import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import Editable, {
  TInnerProps,
  EditablePropsWithoutChildren
} from "./editable";
import omit from "./omit";

export type TOuterProps<TValue> = Partial<
  EditablePropsWithoutChildren<TValue>
> & { [x: string]: any };

export default function withEditable<TValue extends Object>(
  Component: React.ComponentType<TInnerProps<TValue>>
) {
  const ComponentWithEditable: React.SFC<TOuterProps<TValue>> = ({
    onCancel,
    onDelete,
    onSubmit,
    onUpdate,
    value,
    ...passthroughProps
  }) => {
    return (
      <Editable
        onCancel={onCancel}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        value={value}
      >
        {editableProps => (
          <Component {...passthroughProps} {...editableProps} />
        )}
      </Editable>
    );
  };

  ComponentWithEditable.displayName = `WithEditable(${Component.displayName ||
    (Component as any).name ||
    "Component"})`;

  ComponentWithEditable.propTypes = {
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    onUpdate: PropTypes.func,
    value: PropTypes.any,
    ...omit(Component.propTypes, [
      "onCancel",
      "onDelete",
      "onSubmit",
      "onUpdate",
      "value",
      "status"
    ])
  };

  hoistNonReactStatics<TOuterProps<TValue>, TInnerProps<TValue>>(
    ComponentWithEditable,
    Component
  );
  return ComponentWithEditable;
}
