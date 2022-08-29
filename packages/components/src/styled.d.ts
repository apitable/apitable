// styled.d.ts
import 'styled-components';
import { ITheme } from 'theme';

// declare module 'focus-visible';
declare module 'styled-components' {
  // eslint-disable-next-line
  export interface DefaultTheme extends ITheme { } // extends the global DefaultTheme with our ThemeType
}
