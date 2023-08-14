/* tslint:disable */
/* eslint-disable */
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add_tn(a: number, b: number): number;
/**
* @param {string} _some_th
* @returns {Promise<any>}
*/
export function ping_2(_some_th: string): Promise<any>;
/**
* @param {string} _dst_id
* @returns {any}
*/
export function get_records(_dst_id: string): any;
/**
* @param {any} ts_snapshot
* @param {any} ts_payload
* @returns {any}
*/
export function ts_add_record_to_action(ts_snapshot: any, ts_payload: any): any;
/**
*/
export class DataBusBridge {
  free(): void;
/**
* @param {string} base_url
* @param {string} room_server_url
*/
  constructor(base_url: string, room_server_url: string);
/**
* @returns {Promise<void>}
*/
  init(): Promise<void>;
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
  readonly databusbridge_new: (a: number, b: number, c: number, d: number) => number;
  readonly databusbridge_init: (a: number) => number;
  readonly databusbridge_print: (a: number) => void;
  readonly databusbridge_get_datasheet_pack: (a: number, b: number, c: number) => number;
  readonly ping_2: (a: number, b: number) => number;
  readonly get_records: (a: number, b: number) => number;
  readonly ts_add_record_to_action: (a: number, b: number) => number;
  readonly add_tn: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h13a556433e6c349c: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h97504f3e7f8e0e70: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hd80c5e366b8a49da: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h6afbe4eb6b3c2cb5: (a: number, b: number, c: number, d: number) => void;
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
