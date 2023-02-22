import { InstallPosition } from './enum';

export interface IWidgetPackageItemBase {
  installPosition: InstallPosition;
  onModalClose(installedWidgetId?: string): void;
  showMenu?: (e: React.MouseEvent, props: any) => void;
}
