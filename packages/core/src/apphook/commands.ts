/*
 * Filter有返回值和默认值参数处理
 * Trigger为直接执行的函数
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-09 19:43:51
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-09 19:44:24
 */

export type TriggerCommand = (hookState: any, args: any[]) => void;

export type FilterCommand = (defaultValue: any, hookState: any, args: any[]) => any;
