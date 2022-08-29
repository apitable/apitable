import { View } from './views';
import { ISnapshot } from 'store';

export class NotSupportView extends View {
  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined) {
    return null;
  }

  static getViewIntroduce() {
    return null;
  }
}