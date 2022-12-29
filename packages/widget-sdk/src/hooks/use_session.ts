import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export interface ISession {
  /** Current Login User Information */
  user: {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    avatar: string | undefined;
  }
}

/**
 * Get information about the current users of the widget.
 * 
 * Notes: Since the datasheet can be share out, the id, name, avatar, ect. of the user information in the case of 
 * not logged in is undefined.
 *
 * @returns
 *
 * ### Example
 * ```js
 * import { useSession } from '@apitable/widget-sdk';
 *
 * // Show the currently users name of the widget.
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