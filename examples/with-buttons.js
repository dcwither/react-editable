import {
  filter,
  flow,
  includes,
  keyBy,
  map,
  mapValues
} from 'lodash/fp';

import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import {states} from '../src/state-machine';

const buttonDescriptions = [
  {
    eventName: 'onStart',
    title: 'Start',
    id: 'start',
    visibleStates: [states.PRESENTING],
    type: 'PRIMARY'
  },
  {
    eventName: 'onCancel',
    title: 'Cancel',
    id: 'cancel',
    visibleStates: [states.EDITING, states.COMMITTING],
    type: 'DEFAULT'
  },
  {
    eventName: 'onSubmit',
    title: 'Submit',
    id: 'submit',
    visibleStates: [states.EDITING, states.COMMITTING],
    type: 'PRIMARY'
  },
  {
    eventName: 'onUpdate',
    title: 'Update',
    id: 'update',
    visibleStates: [states.EDITING, states.COMMITTING],
    type: 'PRIMARY'
  },
  {
    eventName: 'onDelete',
    title: 'Delete',
    id: 'delete',
    visibleStates: [states.PRESENTING, states.EDITING, states.COMMITTING],
    type: 'SECONDARY'
  }
];

function withButtons(WrappedComponent, buttons) {
  return class ComponentWithButtons extends React.Component {
    static propTypes = {
      ...flow(
        keyBy('eventName'),
        mapValues(() => PropTypes.func)
      )(buttonDescriptions),
      value: PropTypes.any,
      status: PropTypes.oneOf(Object.keys(states)).isRequired,
      ...WrappedComponent.propTypes
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

    render() {
      return <div>
        <WrappedComponent {...this.props} />
        <div className='buttons'>
          {this.renderButtons()}
        </div>
      </div>;
    }

  };
}

export default (...buttons) =>
  (WrappedComponent) => withButtons(WrappedComponent, buttons);
