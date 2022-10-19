/*
 * appHook inside events set
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-11 19:38:00
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-19 14:22:02
 */
import { FilterCommand, TriggerCommand } from './commands';
import { IRule } from './rules';

export type AddTriggerEvent = (hook: string,
                               command: TriggerCommand,
                               commandArg: any,
                               rule: IRule | undefined,
                               priority: number,
                               isCatch: boolean) => void;

export type AddFilterEvent = (hook: string,
                              command: FilterCommand,
                              commandArg: any,
                              rule: IRule | undefined,
                              priority: number,
                              isCatch: boolean) => void;

export type DoTriggerEvent = (hook: string, hookState?: any) => void;

export type UseFiltersEvent = (hook: string, defaultValue: any, hookState?: any) => void;
