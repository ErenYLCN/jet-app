import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";

/**
 * Custom hook that synchronizes state with URL search parameters
 * @param key - The search parameter key
 * @param defaultValue - Default value when the parameter is not present
 * @returns [value, setValue] - Similar to useState but synced with URL
 */
export function useSearchParamState(
  key: string,
  defaultValue: string = ""
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState<string>(() => {
    const paramValue = searchParams.get(key);
    return paramValue || defaultValue;
  });

  // Update state when URL parameters change (e.g., browser back/forward)
  useEffect(() => {
    const paramValue = searchParams.get(key);
    const newValue = paramValue || defaultValue;
    setState(newValue);
  }, [searchParams, key, defaultValue]);

  const setValue = useCallback(
    (value: string) => {
      setState(value);

      setSearchParams((prev: URLSearchParams) => {
        const newParams = new URLSearchParams(prev);

        if (value && value !== defaultValue) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }

        return newParams;
      });
    },
    [key, defaultValue, setSearchParams]
  );

  return [state, setValue];
}

/**
 * Hook variant for boolean values
 */
export function useSearchParamBooleanState(
  key: string,
  defaultValue: boolean = false
): [boolean, (value: boolean) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState<boolean>(() => {
    const paramValue = searchParams.get(key);
    if (paramValue === null) return defaultValue;
    return paramValue === "true";
  });

  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (paramValue === null) {
      setState(defaultValue);
    } else {
      setState(paramValue === "true");
    }
  }, [searchParams, key, defaultValue]);

  const setValue = useCallback(
    (value: boolean) => {
      setState(value);

      setSearchParams((prev: URLSearchParams) => {
        const newParams = new URLSearchParams(prev);

        if (value !== defaultValue) {
          newParams.set(key, value.toString());
        } else {
          newParams.delete(key);
        }

        return newParams;
      });
    },
    [key, defaultValue, setSearchParams]
  );

  return [state, setValue];
}

/**
 * Hook variant for number values
 */
export function useSearchParamNumberState(
  key: string,
  defaultValue: number = 0
): [number, (value: number) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState<number>(() => {
    const paramValue = searchParams.get(key);
    if (paramValue === null) return defaultValue;
    const numValue = Number(paramValue);
    return isNaN(numValue) ? defaultValue : numValue;
  });

  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (paramValue === null) {
      setState(defaultValue);
    } else {
      const numValue = Number(paramValue);
      setState(isNaN(numValue) ? defaultValue : numValue);
    }
  }, [searchParams, key, defaultValue]);

  const setValue = useCallback(
    (value: number) => {
      setState(value);

      setSearchParams((prev: URLSearchParams) => {
        const newParams = new URLSearchParams(prev);

        if (value !== defaultValue) {
          newParams.set(key, value.toString());
        } else {
          newParams.delete(key);
        }

        return newParams;
      });
    },
    [key, defaultValue, setSearchParams]
  );

  return [state, setValue];
}
