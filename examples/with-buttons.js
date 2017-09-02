import {
  filter,
  flow,
  includes,
  keyBy,
  map,
  mapValues
} from 'lodash/fp';

import PropTypes from 'prop-types';
import React from 'react';
import {states} from '../src/state-machine';

const buttonDescriptions = [
  {
    eventName: 'onStart',
    title: 'Start',
    id: 'start',
    visibleStates: [states.PRESENTING]
  },
  {
    eventName: 'onCancel',
    title: 'Cancel',
    id: 'cancel',
    visibleStates: [states.EDITING, states.COMMITTING]
  },
  {
    eventName: 'onDelete',
    title: 'Delete',
    id: 'delete',
    visibleStates: [states.PRESENTING, states.EDITING, states.COMMITTING]
  },
  {
    eventName: 'onSubmit',
    title: 'Submit',
    id: 'submit',
    visibleStates: [states.EDITING, states.COMMITTING]
  },
  {
    eventName: 'onUpdate',
    title: 'Update',
    id: 'update',
    visibleStates: [states.EDITING, states.COMMITTING]
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
      status: PropTypes.oneOf(states).isRequired,
      ...WrappedComponent.propTypes
    };

    renderButtons() {
      const {status} = this.props;

      return flow(
        filter(({id}) => includes(id)(buttons)),
        filter(({eventName}) => Boolean(this.props[eventName])),
        filter(({visibleStates}) => includes(status)(visibleStates)),
        map(({eventName, title, identifier}) =>
          <button
            disabled={status === states.COMMITTING}
            key={identifier}
            onClick={this.props[eventName]}
          >
            {title}
          </button>
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
