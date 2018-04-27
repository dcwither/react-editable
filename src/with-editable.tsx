import PropTypes from "prop-types";
import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import Editable, {
  TInnerProps,
  EditablePropsWithoutChildren
} from "./editable";
import omit from "./omit";

export { TInnerProps };

export type TOuterProps<TValue, TCommitType> = EditablePropsWithoutChildren<
  TValue,
  TCommitType
> & { [x: string]: any };

export default function withEditable<TValue, TCommitType = string>(
  Component: React.ComponentType<TInnerProps<TValue, TCommitType>>
) {
  const ComponentWithEditable: React.SFC<TOuterProps<TValue, TCommitType>> = ({
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
    TOuterProps<TValue, TCommitType>,
    TInnerProps<TValue, TCommitType>
  >(ComponentWithEditable, Component);
  return ComponentWithEditable;
}
