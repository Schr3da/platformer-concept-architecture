export type SubscriberCb<T> = (next: T, previous: T) => void; 

export interface ISubscriber<T> {
  id: string | number;
  cb: SubscriberCb<T>;
}

export const removeSubscriber = <T>(
  collection: Array<ISubscriber<T>>,
  toRemove: string | number
) => {
  return (collection || []).filter((s) => s.id !== toRemove);
};

export const findSubscriber = <T>(
  collection: Array<ISubscriber<T>>,
  toFind: string | number
) => {
  const match = (collection || []).find((s) => s.id === toFind);
  return match == null ? null : match;
};
