/// <reference types="react" />
import React from "react";
import { EditableChildProps, EditablePropsWithoutChildren } from "./editable";
export { EditableChildProps };
export declare type WithEditableProps<TValue, TCommitType> = EditablePropsWithoutChildren<TValue, TCommitType> & {
    [x: string]: any;
};
export default function withEditable<TValue = undefined, TCommitType = string>(Component: React.ComponentType<EditableChildProps<TValue, TCommitType>>): React.StatelessComponent<WithEditableProps<TValue, TCommitType>>;
