import React from 'react';
import { Player, Events } from 'core';

// TODO: 直接接入 sentry
export class ErrorBoundary extends React.Component<{ id: string, datasheetId?: string, logError: boolean }, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (!this.props.logError) {
      return;
    }

    // TODO: 第三方 iframe 的小程序怎么操作
    Player.doTrigger(Events.app_error_logger, {
      error,
      metaData: {
        errorInfo,
        props: this.props,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      // TODO: 小程序 i18n 解决方案，不应该引入 vika/core 中 strings.
      return <h1>发生了未知错误，请刷新重试</h1>; //Something went wrong.
    }

    return this.props.children;
  }
}
