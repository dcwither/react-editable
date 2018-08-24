export declare enum Status {
    PRESENTING = "PRESENTING",
    EDITING = "EDITING",
    COMMITTING = "COMMITTING",
}
export declare enum Action {
    CANCEL = "CANCEL",
    CHANGE = "CHANGE",
    COMMIT = "COMMIT",
    FAIL = "FAIL",
    START = "START",
    SUCCESS = "SUCCESS",
}
export declare type State<TValue> = {
    status: Status;
    value?: TValue;
};
export declare const transitions: {
    [status: string]: {
        [action: string]: <TValue>(value: TValue) => State<TValue>;
    };
};
export default function transition<TValue>(status: Status, action: Action, value?: TValue): State<TValue>;
