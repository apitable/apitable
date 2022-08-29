package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.NodeFavoriteEntity;

/**
 * <p>
 * 节点收藏表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/9/1
 */
public interface NodeFavoriteMapper extends BaseMapper<NodeFavoriteEntity> {

    /**
     * 有序查询收藏的节点ID
     *
     * @param memberId 成员ID
     * @return 节点ID列表
     * @author Chambers
     * @date 2020/9/1
     */
    List<String> selectOrderNodeIdByMemberId(@Param("memberId") Long memberId);

    /**
     * 查询节点ID
     *
     * @param memberId 成员ID
     * @return 节点ID列表
     * @author Chambers
     * @date 2020/9/1
     */
    List<String> selectNodeIdByMemberId(@Param("memberId") Long memberId);

    /**
     * 查询指定成员、节点的数量
     *
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @return count
     * @author Chambers
     * @date 2020/9/1
     */
    Integer countByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * 查询前置节点ID
     *
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @return preNodeId
     * @author Chambers
     * @date 2020/9/1
     */
    String selectPreNodeIdByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * 更改前置节点ID
     *
     * @param newPreNodeId    新前置节点
     * @param originPreNodeId 原前置节点
     * @param memberId        成员ID
     * @return 执行结果数
     * @author Chambers
     * @date 2020/9/1
     */
    int updatePreNodeIdByMemberIdAndPreNodeId(@Param("newPreNodeId") String newPreNodeId, @Param("originPreNodeId") String originPreNodeId, @Param("memberId") Long memberId);

    /**
     * 更改前置节点ID
     *
     * @param preNodeId 新前置节点
     * @param memberId  成员ID
     * @param nodeId    节点ID
     * @return 执行结果数
     * @author Chambers
     * @date 2020/9/1
     */
    int updatePreNodeIdByMemberIdAndNodeId(@Param("preNodeId") String preNodeId, @Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * 取消收藏（硬删）
     *
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @return 执行结果数
     * @author Chambers
     * @date 2020/9/1
     */
    int deleteByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);
}
