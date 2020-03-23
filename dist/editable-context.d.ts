import React, { ReactNode } from "react";
import { EditableArgs, EditableResponse } from "./use-editable";
export declare const EditableContextConsumer: React.Consumer<EditableResponse<any, string>>;
export declare type EditableProps<TValue, TCommitType> = EditableArgs<TValue, TCommitType> & {
    children: ReactNode;
};
export declare function Editable<TValue, TCommitType extends string>(props: EditableProps<TValue, TCommitType>): JSX.Element;
export declare function useEditableContext<TValue, TCommitType extends string>(): EditableResponse<TValue, TCommitType>;
