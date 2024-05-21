import { nonNullish } from '$lib/utils/utils';

export const toNullable = <T>(value?: T | null): [] | [T] => {
	return nonNullish(value) ? [value] : [];
};

export const fromNullable = <T>(value: [] | [T]): T | undefined => {
	return value?.[0];
};

export const toArray = async <T>(data: T): Promise<Array<number>> => {
	const blob: Blob = new Blob([JSON.stringify(data)], {
		type: 'application/json; charset=utf-8'
	});
	return [...new Uint8Array(await blob.arrayBuffer())];
};

export const fromArray = async <T>(data: Array<number> | Uint8Array): Promise<T> => {
	const blob: Blob = new Blob([new Uint8Array(data)], {
		type: 'application/json; charset=utf-8'
	});
	return JSON.parse(await blob.text());
};

export const isOk = <T>(obj: any): obj is { ok: T } => {
    return 'ok' in obj;
  }
  
  export const isErr = <T>(obj: any): obj is { err: T } => {
    return 'err' in obj;
  }
  