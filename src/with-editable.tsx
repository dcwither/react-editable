import PropTypes from "prop-types";
import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import Editable from "./editable";
import omit from "./omit";

export default function withEditable(Component) {
  const ComponentWithEditable: React.SFC<{ [x: string]: any }> = ({
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
    Component.name ||
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

  hoistNonReactStatics(ComponentWithEditable, Component);
  return ComponentWithEditable;
}
