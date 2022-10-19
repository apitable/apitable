/*
 * Action, behavior for apphook
 * Action = Command + Command Arguments
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-07 11:09:17
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-10 14:03:19
 */
import { FilterCommand, TriggerCommand } from './commands';

export interface ITriggerAction {
    command: TriggerCommand;
    args: any[];
}
export interface IFilterAction {
    command: FilterCommand;
    args: any[];
}
