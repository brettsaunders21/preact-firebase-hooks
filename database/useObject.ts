import { useEffect, useMemo } from 'preact/hooks';
import firebase from 'firebase/app';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type ObjectHook = LoadingHook<firebase.database.DataSnapshot, firebase.FirebaseError>;
export type ObjectValHook<T> = LoadingHook<T, firebase.FirebaseError>;

export const useObject = (query?: firebase.database.Query | null): ObjectHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.database.DataSnapshot,
    firebase.FirebaseError
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(
    () => {
      const query = ref.current;
      if (!query) {
        setValue(undefined);
        return;
      }

      query.on('value', setValue, setError);

      return () => {
        query.off('value', setValue);
      };
    },
    [ref.current]
  );

  return [value, loading, error];
};

export const useObjectVal = <T>(
  query?: firebase.database.Query | null,
  options?: {
    keyField?: string;
  }
): ObjectValHook<T> => {
  const [snapshot, loading, error] = useObject(query);
  const value = useMemo(
    () =>
      snapshot
        ? snapshotToData(snapshot, options ? options.keyField : undefined)
        : undefined,
    [snapshot, options && options.keyField]
  );
  return [value, loading, error];
};
