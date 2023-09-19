export const CONST_ENABLE_AUTOMATION_NODE = false;

export function orDisabled<T>(arr: T[], enabled: boolean) {
  return enabled ? arr : [];
}
