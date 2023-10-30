export const CONST_MAX_TRIGGER_COUNT = 3;
export const CONST_MAX_ACTION_COUNT = 9;
export function orDisabled<T>(arr: T[], enabled: boolean) {
    return enabled ? arr : [];
}
