import { View } from './views';
import { ISnapshot } from '../../exports/store';

export class NotSupportView extends View {
  static generateDefaultProperty(_snapshot: ISnapshot, _activeViewId: string | null | undefined) {
    return null;
  }

  static getViewIntroduce() {
    return null;
  }
}