import * as React from 'react';

export interface ICheckoutSessionMain {
  onCancel: () => void | null;
  themeColor: string;
  contentRight: React.ReactNode;
}
export interface ICheckoutSessionConfig {
  modalHeaderTitle: React.ReactNode;
  modalHeaderMessage: React.ReactNode;
  modalHeaderBg: React.ReactNode;
  themeColor: string;
  contentRight: React.ReactNode;
  Main: React.FC<ICheckoutSessionMain>;
}
