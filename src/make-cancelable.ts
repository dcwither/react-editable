// https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html

export type CancelablePromise<T> = Promise<T> & {
  cancel: () => void;
};

export default function makeCancelable<T>(
  promise: Promise<T>
): CancelablePromise<T> {
  let hasCanceled = false;

  const cancelablePromise: CancelablePromise<T> = new Promise(
    (resolve, reject) => {
      promise.then(
        val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
        error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
      );
    }
  ) as CancelablePromise<T>;

  cancelablePromise.cancel = () => {
    hasCanceled = true;
  };

  return cancelablePromise;
}
