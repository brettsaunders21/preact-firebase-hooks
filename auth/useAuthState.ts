import firebase from 'firebase/app';
import { useEffect } from 'preact/hooks';
import { LoadingHook, useLoadingValue } from '../util';
import firebase from 'firebase/app';

export type AuthStateHook = LoadingHook<firebase.User, firebase.auth.Error>;

export default (auth: firebase.auth.Auth): AuthStateHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    firebase.User,
    firebase.auth.Error
  >(() => auth.currentUser);

  useEffect(
    () => {
      const listener = auth.onAuthStateChanged(setValue, setError);

      return () => {
        listener();
      };
    },
    [auth]
  );

  return [value, loading, error];
};
