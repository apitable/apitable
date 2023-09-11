/* tslint:disable */
/* eslint-disable */
/**
* @returns {any}
*/
export function json0_seri(): any;
/**
* @param {any} op
* @returns {any}
*/
export function json0_inverse(op: any): any;
/**
* @param {any} snapshot
* @param {any} payload
* @returns {any}
*/
export function action_set_cell(snapshot: any, payload: any): any;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add_tn(a: number, b: number): number;
/**
* @param {string} _dst_id
* @returns {any}
*/
export function get_records(_dst_id: string): any;
/**
* @param {any} snapshot
* @param {any} payload
* @returns {any}
*/
export function action_add_record(snapshot: any, payload: any): any;
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
* @param {string} dst_id
* @returns {Promise<any>}
*/
  delete_cache(dst_id: string): Promise<any>;
/**
* @param {string} dst_id
* @returns {Promise<any>}
*/
  get_datasheet_pack(dst_id: string): Promise<any>;
/**
* @param {string | undefined} data
* @returns {string | undefined}
*/
  json0_create(data?: string): string | undefined;
/**
* @param {string} snapshot
* @param {string} operation
* @returns {string}
*/
  json0_apply(snapshot: string, operation: string): string;
/**
* @param {string} _op
* @param {string} _other_op
* @param {string} _op_type
* @returns {any}
*/
  json0_transform(_op: string, _other_op: string, _op_type: string): any;
/**
* @param {string} left_op
* @param {string} right_op
* @returns {any}
*/
  json0_transform_x(left_op: string, right_op: string): any;
/**
* @param {string} op
* @returns {any}
*/
  json0_invert(op: string): any;
/**
* @param {string} op
* @param {string} other_op
* @returns {any}
*/
  json0_compose(op: string, other_op: string): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_databusbridge_free: (a: number) => void;
  readonly databusbridge_new: (a: number, b: number, c: number, d: number) => number;
  readonly databusbridge_init: (a: number) => number;
  readonly databusbridge_delete_cache: (a: number, b: number, c: number) => number;
  readonly databusbridge_get_datasheet_pack: (a: number, b: number, c: number) => number;
  readonly databusbridge_json0_create: (a: number, b: number, c: number, d: number) => void;
  readonly databusbridge_json0_apply: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly databusbridge_json0_transform: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly databusbridge_json0_transform_x: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly databusbridge_json0_invert: (a: number, b: number, c: number, d: number) => void;
  readonly databusbridge_json0_compose: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly json0_seri: (a: number) => void;
  readonly json0_inverse: (a: number, b: number) => void;
  readonly action_set_cell: (a: number, b: number, c: number) => void;
  readonly get_records: (a: number, b: number) => number;
  readonly action_add_record: (a: number, b: number, c: number) => void;
  readonly add_tn: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly wasm_bindgen__convert__closures__invoke1_mut__h1c96eaa25d150746: (a: number, b: number, c: number) => void;
  readonly wasm_bindgen__convert__closures__invoke1_mut__h4e68db465de2e92e: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__haae58e6881709f81: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf88c8e3624339deb: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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
