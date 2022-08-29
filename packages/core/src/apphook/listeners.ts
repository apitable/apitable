import { IRule } from './rules';
import { ITriggerAction, IFilterAction } from './actions';

/**
 * 母Listener接口，一般不对外使用
 *
 * @export
 * @interface IListener
 */
export interface IListener {
    type: ListenrType;
    priority: number;
    hook: string;
    rule?: IRule;
    isCatch?: boolean;
}

export interface ITrigger extends IListener {
    action: ITriggerAction;
}

export interface IFilter extends IListener {
    action: IFilterAction;
}

export enum ListenrType {
    Trigger = 'Trigger',
    Filter = 'Filter',
}
