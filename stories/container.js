import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';

export default function Container(storyFn) {
  return <MuiThemeProvider>
    <Paper style={{display: 'table', margin: '3em auto', padding: '1em 5em'}}>
      {storyFn()}
    </Paper>
  </MuiThemeProvider>;
}

Container.propTypes = {
  children: PropTypes.node,
};
