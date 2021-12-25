import { AsyncIteratorObject } from "index";

export type AsyncArrayCallBack<T, TResult> = (el: T, arr: T[]) => Promise<TResult>;


export function GetAsyncIterator<T, TResult>(array: T[], callback: AsyncArrayCallBack<T, TResult>, batchSize = 1): AsyncIterable<TResult> {
    return {
        [Symbol.asyncIterator](): AsyncIteratorObject<TResult> {
            return {
                _arr: array,
                _i: 0,
                _promises: [],
                _batchSize: batchSize,
                _cb: callback,
                async next(): Promise<IteratorResult<TResult>> {
                    if (this._i >= this._promises.length) {
                        const promises = this._arr.slice(this._i, this._i + batchSize).map((el: T) => this._cb(el, this._arr));
                        this._promises.push(...promises);
                    }
                    if (this._i < this._arr.length) {
                        const result = await this._promises[this._i++];
                        return { value: result, done: false };
                    }
                    return { value: undefined as any, done: true };
                }
            }
        }
    }
}

export async function MapAsync<T, TResult>(array: T[], callback: AsyncArrayCallBack<T, TResult>, batchSize = 1) {
    const result = [];
    for await (const res of GetAsyncIterator(array, callback, batchSize)) {
        result.push(res);
    }
    return result;
}

Object.defineProperty(Array.prototype, "mapAsync", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: async function <T, TResult>(callback: AsyncArrayCallBack<T, TResult>, batchSize = 1) {
        const result = [];
        for await (const res of GetAsyncIterator(this as T[], callback, batchSize)) {
            result.push(res);
        }
        return result;
    }
});

declare global {
    interface Array<T> {
        mapAsync: <TResult>(callback: AsyncArrayCallBack<T, TResult>, batchSize?: number) => Promise<TResult[]>
    }
}


(async () => {
    const result = await [5, 10, 15, 20, 25].mapAsync((el) => {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(el, el * 4);
                resolve(el * 4);
            }, 1000);
        })
    }, 2);

    console.log(result);
})();