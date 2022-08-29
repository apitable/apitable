import { get, cloneDeep } from 'lodash';

export const EMPTY_CONTENT = [
  {
    type: 'paragraph',
    children: [
      {
        text:''
      },
    ],
  },
];

export const draft2slate = (content: any) => {
  if (get(content, 'blocks')) {
    const { blocks, entityMap } = content;
    const result: object[]= [];
    for (const block of blocks) {
      const { text, entityRanges } = block;
      const res:{type: string; children: object[]} = {
        type: 'paragraph',
        children: []
      };
      if (entityRanges && entityRanges.length) {
        let start = 0;
        for (const entityRange of entityRanges) {
          const { offset, length, key } = entityRange;
          res.children.push({ text: text.slice(start, offset) }); // 插入text节点

          res.children.push({
            data: entityMap[key].data.mention,
            type: 'mention',
            children: [{ text: '' }],
          }); // 插入mention
          start = offset + length;
        }
        res.children.push({ text: text.slice(start) }); // 插入剩余的text节点
      } else {
        res.children.push({ text });
      }
      result.push(res);
      result.push(cloneDeep(EMPTY_CONTENT[0]));
    }
    return result;
  }
  return content || EMPTY_CONTENT;
};