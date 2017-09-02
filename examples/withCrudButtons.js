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

const buttonDescriptions = [
  {eventName: 'onStart', title: 'Start', id: 'start'},
  {eventName: 'onCancel', title: 'Cancel', id: 'cancel'},
  {eventName: 'onDelete', title: 'Delete', id: 'delete'},
  {eventName: 'onSubmit', title: 'Submit', id: 'submit'},
  {eventName: 'onUpdate', title: 'Update', id: 'update'}
];

export default function withCrudButtons(WrappedComponent, ...buttons) {
  return class ComponentWithCrudButtons extends React.Component {
    static propTypes = {
      ...flow(
        keyBy('eventName'),
        mapValues(() => PropTypes.func)
      )(buttonDescriptions),
      value: PropTypes.any,
      ...WrappedComponent.propTypes
    };

    renderActions() {
      return flow(
        filter(({id}) => includes(id)(buttons)),
        filter(({eventName}) => Boolean(this.props[eventName])),
        map(({eventName, title, identifier}) =>
          <button key={identifier} onClick={this.props[eventName]}>{title}</button>
        )
      )(buttonDescriptions);
    }

    render() {
      return <div>
        <WrappedComponent {...this.props} />
        <div>
          {this.renderActions()}
        </div>
      </div>;
    }

  };
}
