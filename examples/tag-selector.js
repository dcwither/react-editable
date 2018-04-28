import Chip from "material-ui/Chip";
import PropTypes from "prop-types";
import React from "react";
import { slice } from "ramda";

export default class TagSelector extends React.Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
  };

  handleDelete(idx) {
    const { tags, onChange } = this.props;
    onChange([...slice(0, idx, tags), ...slice(idx + 1, Infinity, tags)]);
  }

  render() {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {this.props.tags.map((tag, idx) => (
          <Chip
            style={{ margin: 4 }}
            key={idx}
            onRequestDelete={() => this.handleDelete(idx)}
          >
            {tag}
          </Chip>
        ))}
      </div>
    );
  }
}
