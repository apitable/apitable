package com.vikadata.api.modular.workspace.service;

import java.util.Optional;

import com.vikadata.api.model.vo.node.NodeShareInfoVO;
import com.vikadata.api.model.vo.node.NodeShareSettingInfoVO;
import com.vikadata.api.modular.workspace.model.NodeSharePropsDTO;

/**
 * <p>
 * 节点分享 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 19:54
 */
public interface INodeShareService {

    /**
     * 获取节点分享设置信息
     *
     * @param nodeId 节点ID
     * @return NodeShareSettingsVo 视图
     * @author Shawn Deng
     * @date 2020/3/25 17:40
     */
    NodeShareSettingInfoVO getNodeShareSettings(String nodeId);

    /**
     * 更改分享设置
     *
     * @param userId 用户ID
     * @param nodeId 节点ID
     * @param props  分享选项参数
     * @return 分享ID
     * @author Shawn Deng
     * @date 2020/10/16 14:21
     */
    String updateShareSetting(Long userId, String nodeId, NodeSharePropsDTO props);

    /**
     * 获取节点分享信息
     *
     * @param shareId 分享ID
     * @return NodeShareInfoVo 节点分享信息视图
     * @author Shawn Deng
     * @date 2020/3/24 20:02
     */
    NodeShareInfoVO getNodeShareInfo(String shareId);

    /**
     * 检查分享是否存在
     *
     * @param shareId 分享ID
     * @author Chambers
     * @date 2021/4/28
     */
    void checkShareIfExist(String shareId);

    /**
     * 检查数表以及父节点路径是否被分享出去
     *
     * @param dstId 数表ID
     * @author Shawn Deng
     * @date 2020/3/25 15:34
     */
    void checkNodeHasShare(String dstId);

    /**
     * 关闭节点分享
     *
     * @param userId   用户ID
     * @param nodeId   节点ID
     * @author Shawn Deng
     * @date 2020/3/25 17:04
     */
    void disableNodeShare(Long userId, String nodeId);

    /**
     * 关闭用户所有节点分享
     *
     * @param userId   用户ID
     */
    void disableNodeSharesByUserId(Long userId);

    /**
     * 转存分享节点数据到指定空间站
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @param shareId 分享ID
     * @return 新节点ID
     * @author Shawn Deng
     * @date 2020/3/26 13:17
     */
    String storeShareData(Long userId, String spaceId, String shareId);

    /**
     * 根据分享Id获取节点名称
     * @param shareId 分享节点id
     * @return nodeName
     */
    Optional<String> getNodeNameByShareId(String shareId);
}
