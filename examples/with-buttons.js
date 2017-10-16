import {EditableState, EditableStateType} from '../src';
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

const buttonDescriptions = [
  {
    eventName: 'onStart',
    title: 'Start',
    id: 'start',
    visiableStates: [EditableState.PRESENTING],
    type: 'PRIMARY',
  },
  {
    eventName: 'onCancel',
    title: 'Cancel',
    id: 'cancel',
    visiableStates: [EditableState.EDITING, EditableState.COMMITTING],
    type: 'DEFAULT',
  },
  {
    eventName: 'onSubmit',
    title: 'Submit',
    id: 'submit',
    visiableStates: [EditableState.EDITING, EditableState.COMMITTING],
    type: 'PRIMARY',
  },
  {
    eventName: 'onUpdate',
    title: 'Update',
    id: 'update',
    visiableStates: [EditableState.EDITING, EditableState.COMMITTING],
    type: 'PRIMARY',
  },
  {
    eventName: 'onDelete',
    title: 'Delete',
    id: 'delete',
    visiableStates: [EditableState.PRESENTING, EditableState.EDITING, EditableState.COMMITTING],
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
      status: EditableStateType.isRequired,
      value: PropTypes.any,
      ...Component.propTypes,
    };

    renderButtons() {
      const {status} = this.props;

      return flow(
        filter(({id}) => includes(id)(buttons)),
        filter(({eventName}) => Boolean(this.props[eventName])),
        filter(({visiableStates}) => includes(status)(visiableStates)),
        map(({eventName, title, id, type}) =>
          <RaisedButton
            disabled={status === EditableState.COMMITTING}
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
