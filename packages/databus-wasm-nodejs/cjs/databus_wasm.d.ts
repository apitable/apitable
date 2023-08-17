/* tslint:disable */
/* eslint-disable */
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add_tn(a: number, b: number): number;
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
  get_datasheet_pack(dst_id: string): Promise<any>;
}
