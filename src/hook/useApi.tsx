import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { useApiStatus } from './useApiStatus';
import { PENDING, SUCCESS, ERROR } from './constants/apiStatus';
import { applyDynamicPathParams } from '../utils/dynamicParams';
import _ from 'lodash';

const requestCache = new Map();


interface UseApiConfig<TData, TError> extends AxiosRequestConfig {
  initialData?: TData;
  onSuccess?: (data: TData) => void;
  onError?: (error: AxiosError<TError>) => void;
  onFinally?: (data?: TData, error?: AxiosError<TError>) => void;
  onCancel?: () => void;
  triggerOnMount?: boolean;
  pathParams?: Record<string, string | number>;
}

export function useApi<TData = unknown, TError = unknown>(
  initialUrl: string,
  config: UseApiConfig<TData, TError>
) {
  const {
    initialData,
    onSuccess,
    onError,
    onFinally,
    onCancel,
    pathParams,
    triggerOnMount = false,
    ...initialAxiosRequestConfig
  } = config;

  const [data, setData] = useState<TData | undefined>(initialData);
  const [error, setError] = useState<TError | AxiosError | unknown>();
  const { status, setStatus, ...normalizedStatuses } = useApiStatus();
  const lastConfigRef = useRef<Partial<UseApiConfig<TData, TError>>>({});

  const exec = useCallback((overrideConfig: Partial<UseApiConfig<TData, TError>> = {}, force = false) => {
    lastConfigRef.current = { ...overrideConfig };  // Store the last configuration
    const configToUse = { ...config, ...overrideConfig };
    const dynamicUrl = applyDynamicPathParams(initialUrl, configToUse.pathParams || pathParams);
    const requestOptionsString = JSON.stringify({ ...initialAxiosRequestConfig, ...configToUse, url: dynamicUrl });

    if (!force && requestCache.has(requestOptionsString)) {
      return;
    }

    const source = axios.CancelToken.source();
    requestCache.set(requestOptionsString, source);

    const finalRequestOptions: AxiosRequestConfig = {
      ...initialAxiosRequestConfig,
      ...configToUse,
      url: dynamicUrl,
      cancelToken: source.token
    };

    setStatus(PENDING);
    axios(finalRequestOptions).then(response => {
      setData(response.data);
      setStatus(SUCCESS);
      onSuccess?.(response.data);
      onFinally?.(response.data, undefined);
    }).catch(err => {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
        onCancel?.();
        return;
      }
      const axiosError = err as AxiosError<TError>;
      setError(axiosError);
      setStatus(ERROR);
      onError?.(axiosError);
      onFinally?.(undefined, axiosError);
    }).finally(() => {
      requestCache.delete(requestOptionsString);
    });
  }, [initialUrl, pathParams, initialAxiosRequestConfig, onSuccess, onError, onFinally, onCancel, config]);

  const refetch = useCallback(() => {
    if (lastConfigRef.current) {
      exec(lastConfigRef.current, true);  // Force execution to bypass cache and debouncing
    }
  }, [exec]);

  useEffect(() => {
    if (triggerOnMount) {
      exec({}, true);  
    }
    return () => {
      // Clean up on component unmount
      requestCache.clear();
    };
  }, [exec, triggerOnMount]);

  return { data, setData, status, setStatus, error, exec, refetch, ...normalizedStatuses };
}
