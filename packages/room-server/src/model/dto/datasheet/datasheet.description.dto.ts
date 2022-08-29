import { getNewId, IDPrefix } from '@vikadata/core';

export class DatasheetDescriptionDto {
  type: string;
  data: Daum[];
  render: string;
}

interface Daum {
  type: string
  data: Data
  object: string
  children: Children[]
  _id: string
}

interface Data {
  align: string
}

interface Children {
  text: string
}

export function genDatasheetDescriptionDto(text: string): DatasheetDescriptionDto{
  return {
    type: 'slate',
    data: [{
      type: 'paragraph',
      data: {
        align: 'alignLeft'
      },
      object: 'block',
      children: [
        {
          text 
        }
      ],
      _id: getNewId(IDPrefix.Editor)
    },
    {
      type: 'paragraph',
      data: {
        align: 'alignLeft'
      },
      object: 'block',
      children: [
        {
          text: ''
        }
      ],
      _id: getNewId(IDPrefix.Editor)
    }],
    render: `<p class="ve_align_alignLeft">${text}</p><p class="ve_align_alignLeft"></p>`
  };
}
