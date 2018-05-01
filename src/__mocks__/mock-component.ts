import * as React from "react";

import PropTypes from "prop-types";

const MockComponent: React.SFC<any> = () => null;

MockComponent.displayName = "MockComponent";
MockComponent.propTypes = {
  testProp: PropTypes.number
};

export default MockComponent;
