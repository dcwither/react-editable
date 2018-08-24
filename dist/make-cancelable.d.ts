export declare type CancelablePromise<T> = Promise<T> & {
    cancel: () => void;
};
export default function makeCancelable<T>(promise: Promise<T>): CancelablePromise<T>;
