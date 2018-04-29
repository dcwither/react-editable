import Paper from "material-ui/Paper";
import PropTypes from "prop-types";
import React from "react";

export default function Container(storyFn) {
  return (
    <Paper style={{ width: "30em", margin: "3em auto", padding: "1em 3em" }}>
      {storyFn()}
    </Paper>
  );
}

Container.propTypes = {
  children: PropTypes.node
};
