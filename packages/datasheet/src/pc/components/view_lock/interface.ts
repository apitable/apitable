export interface IViewLockProps {
  viewId: string;
  unlockHandle?: () => void;
  onModalClose(): void;
}
