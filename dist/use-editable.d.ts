import { Status } from "./state-machine";
import PropTypes from "prop-types";
export { Status as EditableStatus };
export declare const EditableStatusType: PropTypes.Requireable<string>;
export interface EditableArgs<TValue, TCommitType> {
    onCancel?: (value: TValue) => void;
    onCommit?: (message: TCommitType, value: TValue) => any;
    value: TValue;
}
export interface EditableResponse<TValue, TCommitType> {
    onCancel: () => void;
    onChange: (value: TValue) => void;
    onCommit: (message: TCommitType) => Promise<any>;
    onStart: () => void;
    status: Status;
    value: TValue;
}
export interface EditableState<TValue> {
    status: Status;
    value?: TValue;
}
export default function useEditable<TValue, TCommitType = string>({ value: inputValue, onCancel, onCommit }: EditableArgs<TValue, TCommitType>): EditableResponse<TValue, TCommitType>;
