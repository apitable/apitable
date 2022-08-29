import { withTheme } from '../core';
// import { withTheme } from '@rjsf/core';
// 上面的 core 是定制的 form 下面的默认的。
import { theme } from './theme';
export const MagicVariableForm = withTheme(theme as any);