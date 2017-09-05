import {
  filter,
  flow,
  includes,
  keyBy,
  map,
  mapValues,
} from 'lodash/fp';

import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import {action} from '@storybook/addon-actions';
import {states} from '../src/state-machine';

const buttonDescriptions = [
  {
    eventName: 'onStart',
    title: 'Start',
    id: 'start',
    visibleStates: [states.PRESENTING],
    type: 'PRIMARY',
  },
  {
    eventName: 'onCancel',
    title: 'Cancel',
    id: 'cancel',
    visibleStates: [states.EDITING, states.COMMITTING],
    type: 'DEFAULT',
  },
  {
    eventName: 'onSubmit',
    title: 'Submit',
    id: 'submit',
    visibleStates: [states.EDITING, states.COMMITTING],
    type: 'PRIMARY',
  },
  {
    eventName: 'onUpdate',
    title: 'Update',
    id: 'update',
    visibleStates: [states.EDITING, states.COMMITTING],
    type: 'PRIMARY',
  },
  {
    eventName: 'onDelete',
    title: 'Delete',
    id: 'delete',
    visibleStates: [states.PRESENTING, states.EDITING, states.COMMITTING],
    type: 'SECONDARY',
  },
];

function withButtons(Component, buttons) {
  return class ComponentWithCRUDButtons extends React.Component {
    static displayName = `WithCRUDButtons(${Component.displayName || Component.name || 'Component'})`;

    static WrappedComponent = Component.WrappedComponent || Component;

    static propTypes = {
      ...flow(
        keyBy('eventName'),
        mapValues(() => PropTypes.func)
      )(buttonDescriptions),
      onChange: PropTypes.func.isRequired,
      status: PropTypes.oneOf(Object.keys(states)).isRequired,
      value: PropTypes.any,
      ...Component.propTypes,
    };

    renderButtons() {
      const {status} = this.props;

      return flow(
        filter(({id}) => includes(id)(buttons)),
        filter(({eventName}) => Boolean(this.props[eventName])),
        filter(({visibleStates}) => includes(status)(visibleStates)),
        map(({eventName, title, id, type}) =>
          <RaisedButton
            disabled={status === states.COMMITTING}
            key={id}
            label={title}
            onClick={this.props[eventName]}
            primary={type === 'PRIMARY'}
            secondary={type === 'SECONDARY'}
            style={{marginRight: '1em'}}
          />
        )
      )(buttonDescriptions);
    }

    handleChange = (value) => {
      action('Change')(value);
      return this.props.onChange(value);
    }

    render() {
      return <div>
        <Component {...this.props} onChange={this.handleChange}/>
        <div className='buttons'>
          {this.renderButtons()}
        </div>
      </div>;
    }
  };
}

export default (...buttons) =>
  (Component) => withButtons(Component, buttons);
