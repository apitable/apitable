import { Billing, Products } from './billing.interface';
import Config from './system_config.auto.json';
/**
  * config class, directly get the entire class of SystemConfig
  */
// const SystemConfig: SystemConfigInterface = systemConfigJson as any as SystemConfigInterface;

/**
  * Billing object, quickly get system_config.system table, system constant configuration
  *
  * pass in key
  * @example Conf.api_rate...
  */
// const Billing = SystemConfig. billing as Billing;

const BillingProducts = (Config.billing as any as Billing).products as Products;
export {
  BillingProducts,
};
