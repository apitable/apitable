export interface ICommentContent {
  type?: string;
  text?: string;
  children?: ICommentContent[],
  data?: {
    name: string;
  }
}