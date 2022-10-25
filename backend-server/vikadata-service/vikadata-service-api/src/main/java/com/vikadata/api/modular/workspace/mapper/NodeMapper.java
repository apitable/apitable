package com.vikadata.api.modular.workspace.mapper;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.node.UrlNodeInfoDTO;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.api.model.vo.node.NodeInfoTreeVo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.model.vo.node.NodePathVo;
import com.vikadata.api.model.vo.node.NodeShareTree;
import com.vikadata.api.model.vo.node.RubbishNodeVo;
import com.vikadata.api.model.vo.node.SimpleSortableNodeInfo;
import com.vikadata.api.modular.workspace.model.SimpleNodeInfo;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.NodeEntity;

/**
 * <p>
 * 数据表格表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2019-10-07
 */
public interface NodeMapper extends BaseMapper<NodeEntity> {

    /**
     * 批量插入
     *
     * @param entities 实体
     * @return 执行结果
     */
    int insertBatch(@Param("entities") List<NodeEntity> entities);

    /**
     * 根据节点ID获取所在空间ID
     *
     * @param nodeId 节点ID
     * @return 空间ID
     */
    String selectSpaceIdByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * 获取指定节点类型的节点ID
     *
     * @param spaceId 空间ID
     * @param nodeType 节点类型
     * @return 节点ID
     */
    List<String> selectNodeIdBySpaceIdAndType(@Param("spaceId") String spaceId, @Param("nodeType") Integer nodeType);

    /**
     * 查询节点ID
     *
     * @param nodeIds 节点ID列表
     * @return NodeId
     */
    List<String> selectNodeIdByNodeIdIn(@Param("nodeIds") List<String> nodeIds);

    /**
     * 根据节点ID获取节点名称
     *
     * @param nodeId 节点ID
     * @return 节点名称
     */
    String selectNodeNameByNodeId(@Param("nodeId") String nodeId);

    /**
     * 根据节点ID获取节点名称
     *
     * @param nodeId 节点ID
     * @return 节点名称
     */
    String selectNodeNameByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * 获取根节点ID
     *
     * @param spaceId 空间ID
     * @return 节点ID
     */
    String selectRootNodeIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 模糊搜索节点，返回节点ID
     * 不能搜索根节点
     *
     * @param spaceId 空间ID
     * @param likeName 搜索词
     * @return 节点ID列表
     */
    List<String> selectLikeNodeName(@Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * 模糊搜索节点
     * 不包含根节点和模板节点
     *
     * @param spaceId 空间ID
     * @param likeName 搜索词
     * @return nodeIds
     */
    List<String> selectNodeIdBySpaceIdAndNodeNameLikeIncludeDeleted(@Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * 根据节点批量查询视图
     *
     * @param nodeIds 节点ID集合
     * @param memberId 成员ID
     * @return 节点视图集合
     */
    List<NodeInfoVo> selectNodeInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds, @Param("memberId") Long memberId);

    /**
     * 根据节点批量查询成视图
     * 有序
     *
     * @param nodeIds 节点ID集合
     * @param memberId 成员ID
     * @return 节点视图集合
     */
    List<NodeInfoTreeVo> selectNodeInfoTreeByNodeIds(@Param("nodeIds") Collection<String> nodeIds, @Param("memberId") Long memberId);

    /**
     * 节点基本信息
     * 无逻辑删除判断
     *
     * @param nodeId 节点ID
     * @return BaseNodeInfo
     */
    BaseNodeInfo selectBaseNodeInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * 批量查询节点基本视图
     *
     * @param nodeIds 节点ID集合
     * @return BaseNodeInfo 集合
     */
    List<BaseNodeInfo> selectBaseNodeInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * 批量查询节点信息视图
     *
     * @param nodeIds 节点ID集合
     * @return NodeInfos
     */
    List<NodeInfo> selectInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * 根据节点ID查询视图
     *
     * @param nodeId 节点ID
     * @return NodeInfoVo
     */
    NodeInfoVo selectNodeInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * 查询节点的子节点
     * 有序的
     *
     * @param spaceId 空间ID
     * @param nodeId 节点ID
     * @param depth 递归深度，从1开始
     * @return NodeInfoTreeVo
     */
    List<String> selectSubNodesByOrder(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId, @Param("depth") int depth);

    /**
     * 定位节点，并构造有序的节点集合
     *
     * @param spaceId 空间ID
     * @param nodeId 节点ID
     * @return NodeInfoTreeVo
     */
    @Deprecated
    List<String> selectParentNodesByOrder(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId);

    /**
     * 查询直属子节点ID
     *
     * @param parentId 父节点ID
     * @return 子节点ID集合
     */
    List<String> selectSubNodeIds(@Param("parentId") String parentId);

    /**
     * 查询直属子节点ID
     *
     * @param parentId 父节点ID
     * @return 子节点ID集合
     */
    List<SimpleSortableNodeInfo> selectSubNodeInfo(@Param("parentId") String parentId);

    /**
     * 查询直属子节点ID
     * 有序的节点，性能有所消耗
     *
     * @param nodeId 节点ID
     * @return 子节点ID集合
     */
    List<String> selectOrderSubNodeIds(@Param("nodeId") String nodeId, @Param("nodeType") NodeType nodeType);

    /**
     * 获取节点分享树
     *
     * @param spaceId 空间ID
     * @param nodeId 节点ID
     * @return NodeShareTree
     */
    List<NodeShareTree> selectShareTreeByNodeId(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId);

    /**
     * 根据nodeIds查询分享树视图
     *
     * @param nodeIds 节点ID列表
     * @return NodeShareTree
     */
    List<NodeShareTree> selectShareTree(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * 查询是否存在子节点
     *
     * @param nodeId 节点ID
     * @return TRUE | FALSE
     */
    boolean selectHasChildren(@Param("nodeId") String nodeId);

    /**
     * 查找所有的子节点
     * 无序的，提高查询性能
     *
     * @param nodeId 节点ID
     * @return 子节点ID集合
     */
    List<String> selectAllSubNodeIds(@Param("nodeId") String nodeId);

    /**
     * 按类型查找所有的子节点
     * 无序的，提高查询性能
     *
     * @param nodeId 节点ID
     * @param nodeType 节点类型
     * @return 子节点ID集合
     */
    List<String> selectAllSubNodeIdsByNodeType(@Param("nodeId") String nodeId, @Param("nodeType") Integer nodeType);

    /**
     * 获取父节点下，同一类型的节点名称列表
     *
     * @param parentId 父节点ID
     * @param nodeType 节点类型
     * @param nodeId 剔除的节点（修改时本身）
     * @return 名称列表
     */
    List<String> selectNameList(@Param("parentId") String parentId, @Param("nodeType") Integer nodeType, @Param("nodeId") String nodeId);

    /**
     * 获取节点及子后代的节点ID列表
     *
     * @param nodeIds 节点列表
     * @param isRubbish 是否是回收站节点
     * @return 节点ID列表
     */
    List<String> selectBatchAllSubNodeIds(@Param("nodeIds") List<String> nodeIds, @Param("isRubbish") Boolean isRubbish);

    /**
     * 查询非根节点、非逻辑删除的节点数量
     *
     * @param nodeIds 节点列表
     * @return 节点数量
     */
    Long countByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * 通过节点ID获取空间ID
     *
     * @param nodeId 节点ID
     * @return 空间ID
     */
    String selectSpaceIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * 查询空间ID
     *
     * @param nodeIds 节点ID列表
     * @return SpaceIds
     */
    List<String> selectSpaceIdsByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * 查询节点实体对象
     *
     * @param nodeId 节点ID
     * @return entity
     */
    NodeEntity selectByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * 查询节点实体对象
     *
     * @param nodeIds 节点ID列表
     * @return entity
     */
    List<NodeEntity> selectByNodeIdsIncludeDeleted(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * 根据节点ID查询
     *
     * @param nodeId 节点ID
     * @return 节点实体对象
     */
    NodeEntity selectByNodeId(@Param("nodeId") String nodeId);

    /**
     * 批量根据节点ID列表查询
     *
     * @param nodeIds 节点ID列表
     * @return 节点实体对象列表
     */
    List<NodeEntity> selectByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * 从下往上查询节点路径
     * 包含自身
     *
     * @param nodeId 节点ID
     * @return 节点路径列表
     */
    List<String> selectParentNodePath(@Param("nodeId") String nodeId);

    /**
     * 查询节点的所有上级节点路径
     * 包含自身节点
     * 节点必须是文件夹
     *
     * @param spaceId 空间ID
     * @param nodeId 节点ID
     * @return 节点路径列表
     */
    List<NodePathVo> selectParentNodeListByNodeId(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId);

    /**
     * 查询节点的所有上级节点路径
     * 包含自身节点,但不包含根节点
     *
     * @param spaceId 空间ID
     * @param nodeIds 节点ID列表
     * @return BaseNodeInfoDto
     */
    List<NodeBaseInfoDTO> selectParentNodeByNodeIds(@Param("spaceId") String spaceId, @Param("list") List<String> nodeIds);

    /**
     * 修改信息
     *
     * @param nodeId 节点ID
     * @param parentId 父级节点ID
     * @param preNodeId 前置节点ID
     * @param name 节点名称
     * @return 修改数
     */
    int updateInfoByNodeId(@Param("nodeId") String nodeId, @Param("parentId") String parentId, @Param("preNodeId") String preNodeId, @Param("name") String name);

    /**
     * 修改回收站标志（工作目录删除节点/回收站恢复节点）
     *
     * @param userId 用户ID
     * @param nodeIds 节点ID列表
     * @param isRubbish 回收站标志（是为删除，否为恢复）
     * @return 修改数
     */
    int updateIsRubbishByNodeIdIn(@Param("userId") Long userId, @Param("list") List<String> nodeIds, @Param("isRubbish") Boolean isRubbish);

    /**
     * 逻辑删除节点（删除回收站节点）
     *
     * @param userId 用户ID
     * @param nodeId 节点ID
     * @return 执行结果数
     */
    int updateIsDeletedByNodeId(@Param("userId") Long userId, @Param("nodeId") String nodeId);

    /**
     * 更改删除路径
     *
     * @param nodeId 节点ID
     * @param delPath 删除路径
     * @return 执行结果数
     */
    int updateDeletedPathByNodeId(@Param("nodeId") String nodeId, @Param("delPath") String delPath);

    /**
     * 根据旧前置节点ID，修改新的前置节点ID （自关联实时）
     *
     * @param preNodeId 新的前置节点ID
     * @param parentId 父级节点ID
     * @return 执行结果数
     */
    int updatePreNodeIdByJoinSelf(@Param("preNodeId") String preNodeId, @Param("parentId") String parentId);

    /**
     * 根据旧前置节点ID，修改新的前置节点ID
     *
     * @param newPreNodeId 新的前置节点ID
     * @param originPreNodeId 原前置节点ID
     * @param parentId 父级节点ID
     * @return 修改数
     */
    int updatePreNodeIdBySelf(@Param("newPreNodeId") String newPreNodeId, @Param("originPreNodeId") String originPreNodeId, @Param("parentId") String parentId);

    /**
     * 获取父级节点ID
     *
     * @param nodeId 节点ID
     * @return 父级节点ID
     */
    String selectParentIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * 根据节点ID修改名称
     *
     * @param nodeId 节点ID
     * @param nodeName 节点名称
     * @return 执行结果数
     */
    int updateNameByNodeId(@Param("nodeId") String nodeId, @Param("nodeName") String nodeName);

    /**
     * 根据节点ID修改图标
     *
     * @param nodeId 节点ID
     * @param icon 图标
     * @return 执行结果数
     */
    int updateIconByNodeId(@Param("nodeId") String nodeId, @Param("icon") String icon);

    /**
     * 根据节点ID修改封面图token
     *
     * @param nodeId 节点ID
     * @param cover 封面图token
     * @return 执行结果数
     */
    int updateCoverByNodeId(@Param("nodeId") String nodeId, @Param("cover") String cover);

    /**
     * 根据节点ID查询节点类型
     *
     * @param nodeId 节点ID
     * @return 节点类型
     */
    Integer selectNodeTypeByNodeId(@Param("nodeId") String nodeId);

    /**
     * 通过前置节点ID查询节点ID
     *
     * @param preNodeIdList 前置节点ID(非null)列表
     * @return 节点ID列表
     */
    List<String> selectNodeIdByPreNodeIdIn(@Param("list") List<String> preNodeIdList);

    /**
     * 批量查询节点的父节点
     *
     * @param nodeIds 节点ID列表
     * @return NodeTree列表
     */
    List<SimpleNodeInfo> selectAllParentNodeIdsByNodeIds(@Param("nodeIds") List<String> nodeIds, @Param("includeRoot") boolean includeRoot);

    /**
     * 封禁或解封节点
     *
     * @param nodeId 节点ID
     * @param status 是否封禁(0:否,1:是)
     * @return 执行结果数
     */
    int updateNodeBanStatus(@Param("nodeId") String nodeId, @Param("status") Integer status);

    /**
     * 查询节点是否属于模板
     *
     * @param nodeIds 节点ID列表
     * @return Boolean
     */
    List<Boolean> selectIsTemplateByNodeId(@Param("nodeIds") List<String> nodeIds);

    /**
     * 查询icon,name
     *
     * @param nodeIds 节点ID
     * @return BaseNodeInfoDto
     */
    List<NodeBaseInfoDTO> selectBaseNodeInfoByNodeIdsIncludeDelete(@Param("nodeIds") List<String> nodeIds);

    /**
     * 查询回收舱节点的修改时间
     *
     * @param nodeId 节点ID
     * @return UpdatedAt
     */
    LocalDateTime selectRubbishUpdatedAtByNodeId(@Param("nodeId") String nodeId);

    /**
     * 查询回收舱节点ID（修改时间倒序）
     *
     * @param spaceId 空间ID
     * @param size 加载数量
     * @param beginTime 开始时间（不包含）
     * @param endTime 结束时间（非必须，不包含）
     * @return NodeIds
     */
    List<String> selectRubbishNodeIds(@Param("spaceId") String spaceId, @Param("size") int size,
            @Param("beginTime") LocalDateTime beginTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 获取回收站的节点信息
     *
     * @param spaceId 空间ID
     * @param nodeIds 节点ID列表
     * @param retainDay 保留的天数
     * @return 回收站节点信息视图
     */
    List<RubbishNodeVo> selectRubbishNodeInfo(@Param("spaceId") String spaceId, @Param("nodeIds") List<String> nodeIds, @Param("retainDay") Long retainDay);

    /**
     * 查询节点基本信息
     *
     * @param nodeId 节点ID
     * @return BaseNodeInfoDTO 对象
     */
    NodeBaseInfoDTO selectNodeBaseInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * 修改节点是否展示记录的修改历史
     *
     * @param nodeId 节点ID
     * @param showRecordHistory 节点是否展示记录的修改历史
     * @return int
     */
    int updateExtraShowRecordHistoryByNodeId(@Param("nodeId") String nodeId, @Param("showRecordHistory") int showRecordHistory);

    /**
     * 修改节点的extra
     *
     * @param nodeId 节点ID
     * @param extra 节点extra
     * @return int
     */
    int updateExtraByNodeId(@Param("nodeId") String nodeId, @Param("extra") String extra);

    /**
     * 修改节点--模版转存的钉钉搭的状态
     *
     * @param nodeId 节点ID
     * @param dingTalkDaStatus 钉钉搭应用状态
     * @return int
     */
    int updateDingTalkDaStatusByNodeId(@Param("nodeId") String nodeId, @Param("dingTalkDaStatus") int dingTalkDaStatus);

    /**
     * 根据nodeId查找钉钉搭应用的状态
     *
     * @param nodeId 节点ID
     * @return 钉钉搭应用的状态
     */
    Integer selectDingTalkDaStatusByNodeId(@Param("nodeId") String nodeId);

    /**
     * 查询节点额外信息
     *
     * @param nodeId 节点ID
     * @return String
     */
    String selectExtraByNodeId(@Param("nodeId") String nodeId);

    /**
     * 查找dstId列表中不在回收仓的dstId
     *
     * @param nodeIds 表id列表
     * @return 在回收仓的dstId列表
     */
    List<String> selectNodeIdByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * 根据节点id集获取所属空间id，node name
     *
     * @param nodeId 节点id
     * @return URLNodeInfoVo
     */
    UrlNodeInfoDTO selectSpaceIdAndNodeNameByNodeId(@Param("nodeId") String nodeId);

    /**
     * 根据节点id集获取所属空间id，node name
     *
     * @param nodeIds 节点id
     * @return URLNodeInfoVo
     */
    List<UrlNodeInfoDTO> selectSpaceIdAndNodeNameByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * select node creator by nodeId
     * @param nodeId node id
     * @return creator
     */
    Long selectCreatedByByNodeId(@Param("nodeId") String nodeId);
}
