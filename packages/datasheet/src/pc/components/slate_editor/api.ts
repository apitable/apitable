import { Editor } from 'slate';

export type TApi = (...params: Array<any>) => Promise<unknown>;

export interface IImageResponse {
  imgUrl: string;
}

const Api = new WeakMap();

export enum ApiKeys {
  ImageUpload = 'imageUpload'
}

export const setApi = (editor: Editor, name: ApiKeys, api?: TApi) => {
  const space = Api.get(editor);
  if (!space) {
    Api.set(editor, { [name]: api });
  } else {
    Api.set(editor, { ...space, [name]: api });
  }
};

export const getApi = (editor: Editor, name: ApiKeys) => {
  const space = Api.get(editor);
  if (!space) {
    return null;
  }
  return space[name];
};