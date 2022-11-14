package com.vikadata.api.workspace.service;

import java.util.Optional;

import com.vikadata.api.workspace.vo.NodeShareInfoVO;
import com.vikadata.api.workspace.vo.NodeShareSettingInfoVO;
import com.vikadata.api.workspace.model.NodeSharePropsDTO;

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
