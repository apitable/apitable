import { IWidgetState } from 'interface';

declare module 'react-redux' {
  // eslint-disable-next-line
  interface DefaultRootState extends IWidgetState { }

  export function useSelector<TState = IWidgetState, TSelected = unknown>(
    selector: (state: TState, props?: any) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ): TSelected;
}
