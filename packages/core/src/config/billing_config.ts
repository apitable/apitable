import { Billing, Products } from './billing.interface';
import Config from './system_config.auto.json';

/**
 * config类，直接获取SystemConfig整个类
 */
// const SystemConfig: SystemConfigInterface = systemConfigJson as any as SystemConfigInterface;

/**
 * Billing对象, 快速获取system_config.system表, 系统常量配置
 *
 * 传入key
 * @example Conf.api_rate...
 */
// const Billing = SystemConfig.billing as Billing;

const BillingProducts = (Config.billing as any as Billing).products as Products;
export {
  BillingProducts,
};
