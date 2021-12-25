export type AsyncFunc<T> = (...args: any[]) => Promise<T>
export type AsyncIteratorObject<T> = { [key: string | number]: any } & AsyncIterator<T>

export * from "./array";