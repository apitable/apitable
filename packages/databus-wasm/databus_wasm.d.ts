/* tslint:disable */
/* eslint-disable */
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add_tn(a: number, b: number): number;
/**
* @param {string} some_th
* @returns {Promise<any>}
*/
export function ping_2(some_th: string): Promise<any>;
/**
* @param {string} _dst_id
* @returns {any}
*/
export function get_records(_dst_id: string): any;
/**
*/
export class DataBusBridge {
  free(): void;
/**
* @param {string} base_url
*/
  constructor(base_url: string);
/**
*/
  print(): void;
/**
* @param {string} dst_id
* @returns {Promise<any>}
*/
  get_datasheet_pack(dst_id: string): Promise<any>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_databusbridge_free: (a: number) => void;
  readonly databusbridge_new: (a: number, b: number) => number;
  readonly databusbridge_print: (a: number) => void;
  readonly databusbridge_get_datasheet_pack: (a: number, b: number, c: number) => number;
  readonly ping_2: (a: number, b: number) => number;
  readonly get_records: (a: number, b: number) => number;
  readonly add_tn: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf88c8e3624339deb: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h6f2d41a93fab5bb6: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
