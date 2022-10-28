import React from 'react';
import { Player, Events } from 'core';

// TODO: Access to sentry
export class ErrorBoundary extends React.Component<{ id: string, datasheetId?: string, logError: boolean }, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // update state so that the next rendering shows the degraded UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (!this.props.logError) {
      return;
    }

    // TODO: how does the third-party iframe widget work
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
      // TODO: widget i18n solution, should not introduce strings in the apitable/core
      return <h1>An unknown error has occurred, please refresh and retry</h1>; //Something went wrong.
    }

    return this.props.children;
  }
}
