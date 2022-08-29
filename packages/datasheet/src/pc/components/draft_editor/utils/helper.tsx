import { ISpaceBasicInfo, LINK_REG } from '@vikadata/core';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';

export interface ITextNode {
  type: string;
  data?: { unitId?: string, name?: string, href?: string, raw?: string, isMemberNameModified?: boolean } | string;
  text?: string;
  children?: []
}

function urlDetect(text: string) {
  const urls = Array.from(text.matchAll(LINK_REG));
  if (urls.length) {
    const res: any[] = [];
    for (const url of urls) {
      try {
        const testURL = new URL(url[0]);
        if (testURL.protocol && !/^javascript:/i.test(testURL.protocol)) {
          res.push({ href: testURL.href, raw: url[0] });
        }
      } catch (e) {
        try {
          const testURL = new URL(`http://${url[0]}`);
          res.push({ href: testURL.href, raw: url[0] });
        } catch (e) {
        }
      }
    }
    return res.length ? res: '';
  }
  return '';
}

function replaceUrl(text: string) {
  const urls = urlDetect(text);
  if (urls) {
    let restText = text;
    const res: any = [];
    for(let i = 0; i< urls.length; i++) {
      const url = urls[i];
      const urlIndex = restText.indexOf(url.raw);
      const textBefore = restText.substring(0, urlIndex);
      if (textBefore) {
        res.push(textBefore);
      }
      res.push({ type: 'link', data: url, children: [{ text: '' }] });
      restText = restText.substring(urlIndex + url.raw.length, restText.length);
    }
    if (restText) {
      res.push(restText);
    }
    return res.filter(t => t!== '').map(t => {
      if (typeof t === 'string') {
        return { text: t };
      }
      return t;
    });
  }
  return [{ text }];
}

function transformNode2Link(node: ITextNode): ITextNode | ITextNode[]{
  if (node.text) {
    return replaceUrl(node.text) as ITextNode[];
  }
  const res = Object.assign({}, node);
  if (node.children && node.children.length) {
    res.children = transformNodes2Link(node.children) as any;
  }
  return res;
}

// 检测url转换为带URL的
export function transformNodes2Link(nodes: ITextNode[]): ITextNode[] {
  const res: ITextNode[] = [];
  for (const node of nodes) {
    const _node = transformNode2Link(node);
    if (Array.isArray(_node)) {
      res.push(..._node);
    } else {
      res.push(_node);
    }
  }
  return res;
}

function removeLinkNode(node: ITextNode): ITextNode | ITextNode[] {
  if (node.type === 'link') {
    // 脏数据，旧link格式为{type: 'link', data: string}得兼容一下
    if (typeof node.data === 'string') {
      return { text: node.data } as ITextNode;
    }
    return { text: node?.data?.raw } as ITextNode;
  }
  const res = Object.assign({}, node);
  if (node.children && node.children.length) {
    res.children = removeLinkNodes(node.children) as any;
  }
  return res;
}
// 讲带link element的转换为不带的，是上面的逆运算
export function removeLinkNodes(nodes: ITextNode[]): ITextNode[] {
  const res: ITextNode[] = [];
  for (const node of nodes) {
    const _node = removeLinkNode(node);
    if (Array.isArray(_node)) {
      res.push(..._node);
    } else {
      res.push(_node);
    }
  }
  return res;
}

// 提取mention里面的unitId
export function walk(nodes: ITextNode | ITextNode[]) {
  const res: string[] = [];
  if (Array.isArray(nodes)) {
    for (const n of nodes) {
      res.push(...walk(n));
    }
  } else {
    if (nodes.type === 'mention') {
      if (typeof nodes.data === 'object') {
        res.push(nodes?.data?.unitId || '');
      }
    }
    if (nodes.children && nodes.children.length) {
      for (const child of nodes.children) {
        res.push(...walk(child));
      }
    }
  }
  return [...new Set(res)];
}

// 转换为纯文本
export function serialize(nodes: ITextNode | ITextNode[], spaceInfo?: ISpaceBasicInfo | null, isRemind?: boolean) {
  const res: (string | JSX.Element)[] = [];
  if (Array.isArray(nodes)) {
    for (const n of nodes) {
      res.push(...serialize(n, spaceInfo, isRemind));
    }
  } else {
    if (nodes?.type === 'mention') {
      if (typeof nodes?.data === 'object') {
        const isMemberNameModified = nodes?.data?.isMemberNameModified;
        const title = spaceInfo ? getSocialWecomUnitName({
          name: nodes?.data?.name,
          isModified: isMemberNameModified,
          spaceInfo
        }) : nodes?.data?.name;
        let memberName: string | JSX.Element = '';
        // /node/remind 接口特定成员数据结构
        if (isRemind && spaceInfo && !isMemberNameModified) {
          memberName = ' @$userName=' + (nodes?.data?.name || '') + '$ ';
        } else if (typeof title === 'string') {
          memberName = ' @' + (title || '') + ' ';
        } else { // 企微
          memberName = <span>@{title}</span>;
        }
        res.push(memberName);
      }
    } else if (nodes?.type === 'link'){
      if (typeof nodes?.data === 'object') {
        res.push(nodes?.data?.raw as string);
      }
    } else {
      res.push(nodes?.text || '');
    }
    if (nodes?.children && nodes?.children.length) {
      for (const child of nodes.children) {
        res.push(...serialize(child, spaceInfo, isRemind));
      }
    }
  }
  return res;
}