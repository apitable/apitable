/*

 * Trigger is a function that is directly executed
 * Filter has a return value and a default value parameter processing
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-09 19:43:51
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-09 19:44:24
 */

export type TriggerCommand = (hookState: any, args: any[]) => void;

export type FilterCommand = (defaultValue: any, hookState: any, args: any[]) => any;
