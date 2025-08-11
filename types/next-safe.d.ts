// types/next-safe.d.ts
type MaybePromise<T> = T | Promise<T>;
type SearchParamsShape = Record<string, string | string[] | undefined>;
type SearchParamsInput = MaybePromise<SearchParamsShape>;
type RouteParams<T extends Record<string, string> = Record<string, string>> = { params: T };

export {};
