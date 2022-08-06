import axios from "axios";

export const sleep = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export const asyncInterval = (fn: () => Promise<void>, minDelay: number) => {
  let next = true;
  const stop = () => {
    next = false;
  };

  const iterate = async () => {
    const now = Date.now();
    await fn();
    const duration = Date.now() - now;
    const timeout = Math.max(minDelay - duration, 0);

    if (timeout > 0) {
      await sleep(timeout);
    }

    if (next) {
      await iterate();
    }
  };

  return [iterate, stop] as const;
};

export const unpackError = (error: any) => {
  const { code, name, message } = error ?? {};
  const req = axios.isAxiosError(error) && {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
  };
  return { ...req, code, name, message };
};

export const log = (namespace: string, ...args: any[]) =>
  console.log(
    `[${namespace}]`,
    ...args.map((item) => (item instanceof Error ? unpackError(item) : item))
  );

export const midnight = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
};
