import { IDENTIFY_CODE_LOGIN } from 'config/constant';

export function isPrivateDeployment() {
  return Boolean(process.env.REACT_APP_DEPLOYMENT_MODELS === 'PRIVATE');
}

export function isIdassPrivateDeployment() {
  return getCustomConfig().isIdaas && isPrivateDeployment();
}

declare let window: any;

export function getCustomConfig() {
  return typeof window === 'object' && window.__initialization_data__.envVars || { LOGIN_DEFAULT_VERIFY_TYPE: IDENTIFY_CODE_LOGIN };
}
