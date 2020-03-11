import React, { createContext, ReactNode, useContext } from "react";
import useEditable, {
  EditableArgs,
  EditableResponse,
  EditableStatus
} from "./use-editable";

const EditableContext = createContext<EditableResponse<any, string>>({
  // default value since we want a sane interface
  onCancel: () => null,
  onChange: () => null,
  onCommit: () => Promise.resolve(),
  onStart: () => null,
  status: EditableStatus.PRESENTING,
  // This is any, but we'll assume that this is only called within an appropriate Editable Provider
  value: undefined
});

export type EditableProps<TValue, TCommitType> = EditableArgs<
  TValue,
  TCommitType
> & { children: ReactNode };

export function Editable<TValue, TCommitType extends string>(
  props: EditableProps<TValue, TCommitType>
) {
  const editableValue = useEditable<TValue, TCommitType>({
    value: props.value,
    onCommit: props.onCommit,
    onCancel: props.onCancel
  });
  // Cannot tie down TCommitType to string due to constraints
  return (
    <EditableContext.Provider
      value={editableValue as EditableResponse<any, unknown>}
    >
      {props.children}
    </EditableContext.Provider>
  );
}

export function useEditableContext<
  TValue,
  TCommitType extends string
>(): EditableResponse<TValue, TCommitType> {
  // Re-casting back to TValue and TCommitType for good interface (.d.ts files might have been easier)
  return useContext(EditableContext) as EditableResponse<TValue, TCommitType>;
}
