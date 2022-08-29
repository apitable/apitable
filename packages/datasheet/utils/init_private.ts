import { isPrivateDeployment } from '@vikadata/core';

(() => {
  if (!process.env.SSR) {
    (window as any).REACT_APP_DEPLOYMENT_MODELS = isPrivateDeployment();
  }
})();
