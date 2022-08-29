
export interface IRule {
    condition: ICondition;
    args: any[];
}

export interface ICondition {
    doCheck(): boolean;
}
