import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export interface ISession {
  /** 当前登录用户信息 */
  user: {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    avatar: string | undefined;
  }
}

/**
 * 获取小程序的当前使用者相关信息
 * 
 * 注意： 由于维格表可以分享出去，所以在未登录的情况下的用户信息的id、name、avatar等都是 undefined
 *
 * @returns
 *
 * ### 示例
 * ```js
 * import { useSession } from '@vikadata/widget-sdk';
 *
 * // 显示小程序当前使用者名称
 * function Meta() {
 *   const session = useSession();
 *   return (<div>
 *     <p>{session.user.name}</p>
 *   </div>);
 * }
 * ```
 *
 */
export function useSession(): ISession {
  const user = useSelector(state => {
    return {
      id: state.user?.userId,
      name: state.user?.memberName || state.user?.nickName,
      email: state.user?.email,
      avatar: state.user?.avatar
    };
  }, shallowEqual);
  return useMemo(() => {
    return {
      user
    };
  }, [user]);
}