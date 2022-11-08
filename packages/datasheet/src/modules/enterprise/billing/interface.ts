export interface IExtra {
  // For usage-based functions, pass in how many quantities are currently in use
  usage?: number;
  // For overages, should obstructive prompts
  alwaysAlert?: boolean;
  // The function currently checked and to which subscription level it belongs
  grade?: string;
  // Do not use template information, use this when you want to customize
  message?: string;
  reload?: boolean;
}
