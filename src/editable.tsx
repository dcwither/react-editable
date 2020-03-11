import { Status } from "./state-machine";

import PropTypes from "prop-types";
import useEditable from "./use-editable";

export { Status as EditableStatus };
export const EditableStatusType = PropTypes.oneOf(Object.keys(Status));

export interface EditableChildProps<TValue, TCommitType> {
  onCancel: (value: TValue) => void;
  onChange: (value: TValue) => void;
  onCommit: (message: TCommitType, value: TValue) => Promise<any>;
  onStart: () => void;
  status: Status;
  value: TValue;
}

export type EditableChild<TValue, TCommitType, TChildType> = (
  props: EditableChildProps<TValue, TCommitType>
) => TChildType;

export type EditableProps<TValue, TCommitType, TChildType> = {
  onCancel?: (value: TValue) => void;
  onCommit?: (message: TCommitType, value: TValue) => any;
  value: TValue;
  children: EditableChild<TValue, TCommitType, TChildType>;
};

const Editable = <TValue, TCommitType, TChildType>(
  props: EditableProps<TValue, TCommitType, TChildType>
) => {
  const { value, onCommit, children } = props;
  return children(useEditable({ value, onCommit }));
};

export default Editable;
