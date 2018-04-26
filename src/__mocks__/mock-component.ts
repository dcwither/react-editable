import PropTypes from "prop-types";
import * as React from "react";

const MockComponent: React.SFC = function() {
  return null;
};

MockComponent.displayName = "MockComponent";
MockComponent.propTypes = {
  testProp: PropTypes.number
};

export default MockComponent;
