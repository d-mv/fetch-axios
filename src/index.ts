import axios, { Method, AxiosResponse, AxiosRequestConfig, AxiosProgressEvent } from 'axios';

export type FetchProps<Data> = Partial<Omit<AxiosRequestConfig<Data>, 'cancelToken' | 'signal'>> & {
  url: string;
  method: Method;
  timeout?: number;
  maxRate?: number | [number, number];
};

export interface FetchReturn<Data, Result> {
  request: () => Promise<AxiosResponse<Result, Data>>;
  abort: () => void;
}

export function fetch<Result = never, Data = never>(opts: FetchProps<Data>): FetchReturn<Data, Result> {
  const { signal, abort } = new AbortController();

  const config: AxiosRequestConfig<Data> = { ...opts, signal };

  const request = () => axios<Result>(config);

  return { request, abort };
}

function onDownloadProgress(opts: AxiosProgressEvent) {
  // eslint-disable-next-line no-console
  console.log('down: ', opts.loaded);
}

function onUploadProgress(opts: AxiosProgressEvent) {
  // eslint-disable-next-line no-console
  console.log('up: ', opts.loaded);
}

(async function main() {
  const { request } = fetch<string>({
    url: process.argv[2] ?? '',
    method: 'GET',
    onDownloadProgress,
    onUploadProgress,
  });

  const r = await request();

  // eslint-disable-next-line no-console
  console.log(r.data);
})();
