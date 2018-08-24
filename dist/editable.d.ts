/// <reference types="react" />
import { Status } from "./state-machine";
import PropTypes from "prop-types";
import React from "react";
import { CancelablePromise } from "./make-cancelable";
export { Status as EditableStatus };
export declare const EditableStatusType: PropTypes.Requireable<any>;
export interface EditablePropsWithoutChildren<TValue, TCommitType> {
    onCancel?: (value: TValue) => void;
    onCommit?: (message: TCommitType, value: TValue) => any;
    value: TValue;
}
export interface EditableChildProps<TValue, TCommitType> {
    onCancel: (value: TValue) => void;
    onChange: (value: TValue) => void;
    onCommit: (message: TCommitType, value: TValue) => Promise<any>;
    onStart: () => void;
    status: Status;
    value: TValue;
}
export declare type EditableChild<TValue, TCommitType> = (props: EditableChildProps<TValue, TCommitType>) => React.ReactNode;
export declare type EditableProps<TValue, TCommitType> = EditablePropsWithoutChildren<TValue, TCommitType> & {
    children?: EditableChild<TValue, TCommitType>;
};
export interface EditableState<TValue> {
    status: Status;
    value?: TValue;
}
export default class Editable<TValue, TCommitType = string> extends React.Component<EditableProps<TValue, TCommitType>, EditableState<TValue>> {
    static displayName: string;
    static propTypes: {
        children: PropTypes.Requireable<any>;
        onCommit: PropTypes.Requireable<any>;
        value: PropTypes.Requireable<any>;
    };
    static defaultProps: {
        children: () => null;
    };
    state: EditableState<TValue>;
    commitPromise: CancelablePromise<any> | undefined;
    componentWillUnmount(): void;
    handleStart: () => void;
    handleChange: (nextValue: TValue) => void;
    handleCancel: () => void;
    handleCommit: (message: TCommitType) => Promise<any>;
    render(): React.ReactNode;
}
