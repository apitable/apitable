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
