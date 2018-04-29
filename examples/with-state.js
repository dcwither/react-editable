import Button from "material-ui/Button";
import Promise from "bluebird";
import PropTypes from "prop-types";
import React from "react";
import { action } from "@storybook/addon-actions";
import { omit } from "lodash/fp";

function withState(Component, usePromises) {
  return class ComponentWithState extends React.Component {
    static displayName = `WithState(${Component.displayName ||
      Component.name ||
      "Component"})`;

    static WrappedComponent = Component.WrappedComponent || Component;

    static propTypes = {
      initialValue: Component.propTypes.value || PropTypes.any
    };

    state = {
      value: this.props.initialValue,
      isDeleted: false
    };

    maybeDelayThenSetState(nextState) {
      if (usePromises) {
        return Promise.delay(500).then(() => this.setState(nextState));
      } else {
        this.setState(nextState);
      }
    }

    handleCommit = (message, value) => {
      action(message)(value);
      switch (message) {
        case "CREATE":
        case "UPDATE":
          return this.maybeDelayThenSetState({ value });
        case "DELETE":
          return this.maybeDelayThenSetState({
            value: undefined,
            isDeleted: true
          });
        default:
          throw new Error("bad message");
      }
    };

    handleReset = () => {
      this.setState({
        value: this.props.initialValue,
        isDeleted: false
      });
    };

    render() {
      const {
        state: { value, isDeleted },
        props
      } = this;

      if (isDeleted) {
        return (
          <div>
            <Button
              onClick={this.handleReset}
              color="primary"
              variant="raised"
              style={{ margin: "2em" }}
            >
              Item Deleted - Reset
            </Button>
          </div>
        );
      } else {
        return (
          <Component
            onCommit={this.handleCommit}
            value={value}
            {...omit("initialValue")(props)}
          />
        );
      }
    }
  };
}

export default usePromises => Component => withState(Component, usePromises);
