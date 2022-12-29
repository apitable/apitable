import { MarkType, ElementType } from '../constant';
import { IS_APPLE } from '../helpers/browser';

export const modKey = IS_APPLE ? '⌘' : 'Ctrl';
export const altKey = IS_APPLE ? '⌥' : 'Alt';

export const hotkeyMap = {
  [MarkType.BOLD]: {
    keyboard: 'mod+b',
    platform: `${modKey} B`,
    markdown: '**内容**',
  },
  [MarkType.ITALIC]: {
    keyboard: 'mod+i',
    platform: `${modKey} I`,
    markdown: '_内容_',
  },
  [MarkType.UNDERLINE]: {
    keyboard: 'mod+u',
    platform: `${modKey} U`,
    markdown: '',
  },
  [MarkType.STRIKE_THROUGH]: {
    keyboard: 'mod+shift+s',
    platform: `${modKey} Shift S`,
    markdown: '',
  },
  [MarkType.INLINE_CODE]: {
    keyboard: 'mod+e',
    platform: `${modKey} E`,
    markdown: '`内容`',
  },
  [MarkType.HIGHLIGHT]: {
    keyboard: 'mod+h',
    platform: `${modKey} H`,
    markdown: '',
  },
  [ElementType.LINK]: {
    keyboard: 'mod+k',
    platform: `${modKey} k`,
    markdown: '',
  },
  [ElementType.PARAGRAPH]: {
    keyboard: 'mod+alt+0',
    platform: `${modKey} ${altKey} 0`,
    markdown: '',
  },
  [ElementType.HEADING_ONE]: {
    keyboard: 'mod+alt+1',
    platform: `${modKey} ${altKey} 1`,
    markdown: '# Space',
  },
  [ElementType.HEADING_TWO]: {
    keyboard: 'mod+alt+2',
    platform: `${modKey} ${altKey} 2`,
    markdown: '## Space',
  },
  [ElementType.HEADING_THREE]: {
    keyboard: 'mod+alt+3',
    platform: `${modKey} ${altKey} 3`,
    markdown: '### Space',
  },
  [ElementType.UNORDERED_LIST]: {
    keyboard: 'mod+alt+4',
    platform: `${modKey} ${altKey} 4`,
    markdown: '- Space',
  },
  [ElementType.ORDERED_LIST]: {
    keyboard: 'mod+alt+5',
    platform: `${modKey} ${altKey} 5`,
    markdown: '1. Space',
  },
  [ElementType.TASK_LIST]: {
    keyboard: 'mod+alt+6',
    platform: `${modKey} ${altKey} 6`,
    markdown: '[] Space',
  },
  [ElementType.QUOTE]: {
    keyboard: 'mod+alt+7',
    platform: `${modKey} ${altKey} 7`,
    markdown: '> Space',
  },
};