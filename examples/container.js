import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';

export default function Container({children}) {
  return <Paper style={{width: '30em', margin: '3em', padding: '1em 2em'}}>
    {children}
  </Paper>;
}

Container.propTypes = {
  children: PropTypes.node,
};
