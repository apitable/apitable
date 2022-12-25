/*
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

package com.apitable.workspace.service;

import java.util.Optional;

import com.apitable.workspace.vo.NodeShareInfoVO;
import com.apitable.workspace.vo.NodeShareSettingInfoVO;
import com.apitable.workspace.dto.NodeSharePropsDTO;

public interface INodeShareService {

    /**
     * obtain node sharing settings
     *
     * @param nodeId node id
     * @return NodeShareSettingsVo
     */
    NodeShareSettingInfoVO getNodeShareSettings(String nodeId);

    /**
     * change sharing settings
     *
     * @param userId user id
     * @param nodeId node id
     * @param props  sharing props
     * @return id
     */
    String updateShareSetting(Long userId, String nodeId, NodeSharePropsDTO props);

    /**
     * @param shareId shareId
     * @return NodeShareInfoVo
     */
    NodeShareInfoVO getNodeShareInfo(String shareId);

    /**
     * @param shareId shareId
     */
    void checkShareIfExist(String shareId);

    /**
     * Check whether the number table and the parent node path are shared
     *
     * @param dstId datasheet id
     */
    void checkNodeHasShare(String dstId);

    /**
     * turn off node sharing
     *
     * @param userId user id
     * @param nodeId node id
     */
    void disableNodeShare(Long userId, String nodeId);

    /**
     * turn off all user node sharing
     *
     * @param userId user id
     */
    void disableNodeSharesByUserId(Long userId);

    /**
     * Transfer shared node data to designated space station
     *
     * @param userId user id
     * @param spaceId space id
     * @param shareId shareId
     * @return new node id
     */
    String storeShareData(Long userId, String spaceId, String shareId);

    /**
     * @param shareId shareId
     * @return nodeName
     */
    Optional<String> getNodeNameByShareId(String shareId);
}
