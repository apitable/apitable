import { EmojiNode } from './nodes/EmojiNode';
import ExampleTheme from './themes/ExampleTheme';

const editorConfig = {
  theme: ExampleTheme,
  onError(error) {
    throw error;
  },
  nodes: [EmojiNode]
};

export default editorConfig;
