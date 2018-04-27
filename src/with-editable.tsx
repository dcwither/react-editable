import * as PropTypes from "prop-types";
import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import Editable, {
  TInnerProps,
  EditablePropsWithoutChildren
} from "./editable";
import omit from "./omit";

export type TOuterProps<TCommitType, TValue> = EditablePropsWithoutChildren<
  TCommitType,
  TValue
> & { [x: string]: any };

export default function withEditable<
  TCommitType extends string,
  TValue = undefined
>(Component: React.ComponentType<TInnerProps<TCommitType, TValue>>) {
  const ComponentWithEditable: React.SFC<TOuterProps<TCommitType, TValue>> = ({
    onCancel,
    onCommit,
    value,
    ...passthroughProps
  }) => {
    return (
      <Editable onCancel={onCancel} onCommit={onCommit} value={value}>
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
    onCommit: PropTypes.func,
    value: PropTypes.any,
    ...omit(Component.propTypes, [
      "onCancel",
      "onDelete",
      "onSubmit",
      "onCommit",
      "value",
      "status"
    ])
  };

  hoistNonReactStatics<
    TOuterProps<TCommitType, TValue>,
    TInnerProps<TCommitType, TValue>
  >(ComponentWithEditable, Component);
  return ComponentWithEditable;
}
