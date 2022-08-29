package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.node.NodeShareDTO;
import com.vikadata.entity.NodeShareSettingEntity;

/**
 * <p>
 * 工作台-节点分享设置表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
public interface NodeShareSettingMapper extends BaseMapper<NodeShareSettingEntity> {

    /**
     * 查询分享设置
     *
     * @param shareId 分享ID
     * @return NodeShareSettingEntity 实体
     * @author Shawn Deng
     * @date 2020/3/24 21:34
     */
    NodeShareSettingEntity selectByShareId(@Param("shareId") String shareId);

    /**
     * 根据用户ID查询所有生效node share.
     * @param userId
     * @return
     */
    List<NodeShareSettingEntity> selectEnabledByUserId(@Param("userId") Long userId);

    /**
     * 查询分享设置
     *
     * @param nodeId 节点ID
     * @return NodeShareSettingEntity 实体
     * @author Shawn Deng
     * @date 2020/3/24 21:34
     */
    NodeShareSettingEntity selectByNodeId(@Param("nodeId") String nodeId);

    /**
     * 根据shareId查找节点ID
     *
     * @param shareId 分享ID
     * @return 节点ID
     * @author zoe zheng
     * @date 2020/5/19 5:41 下午
     */
    String selectNodeIdByShareId(@Param("shareId") String shareId);

    /**
     * 根据 shareId 查找最后编辑人
     *
     * @param shareId 分享ID
     * @return 最后编辑人
     * @author Chambers
     * @date 2021/3/17
     */
    Long selectUpdatedByByShareId(@Param("shareId") String shareId);

    /**
     * 批量禁止节点分享
     *
     * @param nodeIds 节点ID集合
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/6/23 21:50
     */
    int disableByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * 根据 shareId 查询空间ID
     *
     * @param shareId 分享ID
     * @return 空间ID
     * @author Chambers
     * @date 2021/1/25
     */
    String selectSpaceIdByShareId(@Param("shareId") String shareId);

    /**
     * 根据 shareId 查询空间ID
     *
     * @param shareId 分享ID
     * @return 空间ID
     * @author Pengap
     * @date 2022/6/7 16:48:18
     */
    String selectSpaceIdByShareIdIncludeDeleted(@Param("shareId") String shareId);

    /**
     * 根据 shareId 查询节点分享信息
     *
     * @param shareId 分享ID
     * @return 节点分享信息
     * @author Chambers
     * @date 2020/7/27
     */
    NodeShareDTO selectDtoByShareId(@Param("shareId") String shareId);

    /**
     * 根据 nodeIds 查询节点分享信息
     *
     * @param nodeIds 节点ID 集合
     * @return 节点分享信息
     * @author Chambers
     * @date 2021/3/3
     */
    List<NodeShareDTO> selectDtoByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * 查找指定成员最后修改的分享节点ID列表
     *
     * @param updaters 最后修改人列表
     * @param spaceId  空间ID
     * @return 节点ID集合
     * @author Shawn Deng
     * @date 2020/6/23 21:40
     */
    List<String> selectNodeIdsByUpdatersAndSpaceId(@Param("updaters") List<Long> updaters, @Param("spaceId") String spaceId);

    /**
     * 查询nodeId和isEnabled
     *
     * @param shareId 分享ID
     * @return NodeShareSettingEntity 实体
     * @author zoe zheng
     * @date 2021/2/4 7:43 下午
     */
    NodeShareSettingEntity selectNodeIdAndEnabledByShareId(@Param("shareId") String shareId);
}
