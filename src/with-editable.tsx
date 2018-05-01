import hoistNonReactStatics from "hoist-non-react-statics";
import PropTypes from "prop-types";
import React from "react";
import Editable, {
  EditableChildProps,
  EditablePropsWithoutChildren
} from "./editable";
import omit from "./omit";

export { EditableChildProps };

export type WithEditableProps<
  TValue,
  TCommitType
> = EditablePropsWithoutChildren<TValue, TCommitType> & { [x: string]: any };

export default function withEditable<TValue = undefined, TCommitType = string>(
  Component: React.ComponentType<EditableChildProps<TValue, TCommitType>>
) {
  const ComponentWithEditable: React.SFC<
    WithEditableProps<TValue, TCommitType>
  > = ({ onCancel, onCommit, value, ...passthroughProps }) => {
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
      "onChange",
      "onCancel",
      "onCommit",
      "value",
      "status"
    ])
  };

  hoistNonReactStatics<
    WithEditableProps<TValue, TCommitType>,
    EditableChildProps<TValue, TCommitType>
  >(ComponentWithEditable, Component);
  return ComponentWithEditable;
}
