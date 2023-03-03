/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { uniqBy } from 'lodash';

/**
 * Get information(including yourself) about collaborators of the environment where the widget is currently running, 
 * which include dashboard, datasheet, mirror.
 * 
 * 
 * Writing to member field cells using collaborator IDs is not supported at this time.
 * 
 * Note: Since the datasheet can be shared, the id, name, and avatar of the collaborator in the case of not being logged in are undefined.
 *
 * @returns
 *
 * ### Example
 * ```js
 * import { useCollaborators } from '@apitable/widget-sdk';
 *
 * // show the currently environment collaborator of the widget
 * function Meta() {
 *   const collaborators = useCollaborators();
 *   return (<div>
 *     <div>Current collaborator: {collaborators.map(collaborator => {
 *       return <p>{collaborator.name || 'Aliens'}</p>
 *     })}</div>
 *   </div>);
 * }
 * ```
 *
 */
export function useCollaborators() {
  const collaborators = useSelector(state => {
    return state.collaborators;
  });
  return useMemo(() => {
    return uniqBy(collaborators, 'userId').map(collaborator => ({
      id: collaborator.userId,
      name: collaborator.memberName || collaborator.userName,
      avatar: collaborator.avatar
    }));
  }, [collaborators]);
}