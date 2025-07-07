import { useState, useEffect, useRef } from "react";

type CallbackFunction<T> = (value: T) => void;

export default function useStateWithCallback<T>(
  initialValue: T
): [T, (value: T, callback?: CallbackFunction<T>) => void] {
  const [state, setState] = useState<T>(initialValue);
  const callbackRef = useRef<CallbackFunction<T> | null>(null);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null;
    }
  }, [state]);

  const setStateWithCallback = (value: T, callback?: CallbackFunction<T>): void => {
    setState(value);
    if (callback) callbackRef.current = callback;
  };

  return [state, setStateWithCallback];
}
