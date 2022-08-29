package com.vikadata.api.modular.workspace.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.Nullable;

import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.read.metadata.ReadSheet;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.model.ro.node.CreateDatasheetRo;
import com.vikadata.api.model.ro.node.ImportExcelOpRo;
import com.vikadata.api.model.ro.node.NodeCopyOpRo;
import com.vikadata.api.model.ro.node.NodeMoveOpRo;
import com.vikadata.api.model.ro.node.NodeOpRo;
import com.vikadata.api.model.ro.node.NodeRelRo;
import com.vikadata.api.model.ro.node.NodeUpdateOpRo;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.NodeFromSpaceVo;
import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.api.model.vo.node.NodeInfoTreeVo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.model.vo.node.NodeInfoWindowVo;
import com.vikadata.api.model.vo.node.NodePathVo;
import com.vikadata.api.model.vo.node.NodeSearchResult;
import com.vikadata.api.model.vo.node.ShowcaseVo;
import com.vikadata.api.modular.workspace.listener.ExcelSheetsDataListener;
import com.vikadata.api.modular.workspace.listener.NodeData;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.modular.workspace.model.NodeCopyEffectDTO;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.DatasheetEntity;
import com.vikadata.entity.DatasheetMetaEntity;
import com.vikadata.entity.DatasheetRecordEntity;
import com.vikadata.entity.NodeEntity;

/**
 * <p>
 * 数据表格表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2019-10-07
 */
public interface INodeService extends IService<NodeEntity> {

    /**
     * 获取根节点ID
     *
     * @param spaceId 空间ID
     * @return 根节点ID
     */
    String getRootNodeIdBySpaceId(String spaceId);

    /**
     * 获取指定空间、指定节点类型的节点ID
     *
     * @param spaceId 空间ID
     * @param type 节点类型
     * @return 节点ID
     */
    List<String> getNodeIdBySpaceIdAndType(String spaceId, Integer type);

    /**
     * 获取节点实体
     *
     * @param nodeId 节点ID
     * @return NodeEntity
     */
    NodeEntity getByNodeId(String nodeId);

    /**
     * 获取存在的节点ID
     *
     * @param nodeIds 节点ID列表
     * @return ExistNodeIds
     */
    List<String> getExistNodeIdsBySelf(List<String> nodeIds);

    /**
     * 获取节点类型
     *
     * @param nodeId 节点ID
     * @return NodeType
     */
    NodeType getTypeByNodeId(String nodeId);

    /**
     * 获取节点所在的空间ID
     *
     * @param nodeId 节点ID
     * @return 空间ID
     */
    String getSpaceIdByNodeId(String nodeId);

    /**
     * 获取所有节点所在的空间ID（多个空间触发异常）
     *
     * @param nodeIds 节点ID列表
     * @return 空间ID
     */
    String getSpaceIdByNodeIds(List<String> nodeIds);

    /**
     * 获取包含删除在内的节点所在的空间ID
     *
     * @param nodeId 节点ID
     * @return 空间ID
     */
    String getSpaceIdByNodeIdIncludeDeleted(String nodeId);

    /**
     * 获取节点是否属于模板
     *
     * @param nodeIds 节点ID列表
     * @return 是否属于模板标志
     */
    Boolean getIsTemplateByNodeIds(List<String> nodeIds);

    /**
     * 获取父节点ID
     *
     * @param nodeId 节点ID
     * @return 父节点ID
     */
    String getParentIdByNodeId(String nodeId);

    /**
     * 获取节点名称
     *
     * @param nodeId 节点ID
     * @return 节点名称
     */
    String getNodeNameByNodeId(String nodeId);

    /**
     * 获取节点路径的节点ID
     * 顺序：第一层级节点 -> 节点自身
     *
     * @param nodeId 节点ID
     * @return 节点路径列表
     */
    List<String> getPathParentNode(String nodeId);

    /**
     * 获取节点信息视图
     *
     * @param nodeIds 节点ID 集合
     * @return NodeInfos
     */
    List<NodeInfo> getNodeInfoByNodeIds(Collection<String> nodeIds);

    /**
     * 查询节点包括下面的所有节点的关联节点
     *
     * @param nodeId 节点ID
     * @return BaseNodeInfo 集合
     */
    List<BaseNodeInfo> getForeignSheet(String nodeId);

    /**
     * 检查节点是否存在
     *
     * @param spaceId 空间ID(校验是否跨空间，非必须)
     * @param nodeId 节点ID
     * @return spaceId
     */
    String checkNodeIfExist(String spaceId, String nodeId);

    /**
     * 检查源表
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param type 节点类型
     * @param extra 节点关联参数
     */
    void checkSourceDatasheet(String spaceId, Long memberId, Integer type, NodeRelRo extra);

    /**
     * 获取用户ID
     *
     * @param userId 用户ID
     * @param nodeId 节点ID
     * @return MemberId
     */
    Long getMemberIdByUserIdAndNodeId(Long userId, String nodeId);

    /**
     * 搜索节点结果视图
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param keyword 关键词
     * @return result 集合
     */
    List<NodeSearchResult> searchNode(String spaceId, Long memberId, String keyword);

    /**
     * 查询节点树
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param nodeId 节点ID
     * @param depth 递归深度，最小为1
     * @return NodeInfoTreeVo
     */
    NodeInfoTreeVo getNodeTree(String spaceId, String nodeId, Long memberId, int depth);

    /**
     * 查询子节点信息
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param nodeId 节点ID
     * @return NodeInfoVo 列表
     */
    List<NodeInfoVo> getChildNodesByNodeId(String spaceId, Long memberId, String nodeId);

    /**
     * 获取节点父级路径
     * 包含根节点
     *
     * @param spaceId 空间ID
     * @param nodeId 节点ID
     * @return 父级路径
     */
    List<NodePathVo> getParentPathByNodeId(String spaceId, String nodeId);

    /**
     * 定位节点
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param nodeId 节点ID
     * @return 节点到根节点的树
     */
    NodeInfoTreeVo position(String spaceId, Long memberId, String nodeId);

    /**
     * 根据节点ID查询节点视图
     *
     * @param spaceId 空间ID
     * @param nodeId 节点ID
     * @param role 节点控制单元角色
     * @return NodeInfoVo
     */
    NodeInfoVo getNodeInfoByNodeId(String spaceId, String nodeId, ControlRole role);

    /**
     * 查询多个节点的视图信息
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param nodeIds 节点ID列表
     * @return NodeInfoVo 列表
     */
    List<NodeInfoVo> getNodeInfoByNodeIds(String spaceId, Long memberId, List<String> nodeIds);

    /**
     * 查询多个节点的视图信息
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param nodeIds 节点ID列表
     * @return NodeInfoVo 列表
     */
    NodeInfoTreeVo getNodeInfoTreeByNodeIds(String spaceId, Long memberId, List<String> nodeIds);

    /**
     * 业务新增节点
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @param nodeOpRo 请求参数
     * @return 节点ID
     */
    String createNode(Long userId, String spaceId, NodeOpRo nodeOpRo);

    /**
     * 创建表单，添加图片(如果需要)
     *
     * @param spaceId 空间ID
     * @param createDatasheetRo 请求参数
     * @return 表单ID
     */
    String createDatasheetWithDesc(String spaceId, Long userId, CreateDatasheetRo createDatasheetRo);

    /**
     * 提供对象新增节点
     *
     * @param userId 用户ID
     * @param dto 参数
     * @return 节点ID
     */
    String createChildNode(Long userId, CreateNodeDto dto);

    /**
     * 批量新增节点
     *
     * @param nodeList 节点实体列表
     * @param dstCount 数表数量，为空时遍历实体列表
     */
    void insertBatch(List<NodeEntity> nodeList, Integer dstCount);

    /**
     * 编辑节点
     *
     * @param userId 用户ID
     * @param nodeId 节点自定义ID
     * @param opRo 请求参数
     */
    void edit(Long userId, String nodeId, NodeUpdateOpRo opRo);

    /**
     * 移动节点
     *
     * @param userId 用户ID
     * @param opRo 请求参数
     * @return 数据有变化的节点
     */
    List<String> move(Long userId, NodeMoveOpRo opRo);

    /**
     * 删除节点
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @param ids 自定义节点ids
     */
    void deleteById(String spaceId, Long memberId, String... ids);

    /**
     * 删除模板映射节点
     *
     * @param userId 用户ID
     * @param nodeIds 节点ids
     */
    void delTemplateRefNode(Long userId, String... nodeIds);

    /**
     * 复制节点
     *
     * @param userId 用户ID
     * @param opRo 请求参数
     * @return 复制完成新的节点ID
     */
    NodeCopyEffectDTO copy(Long userId, NodeCopyOpRo opRo);

    /**
     * 复制节点（包含所有子后代）到指定空间
     *
     * @param userId 用户ID
     * @param destSpaceId 目标空间ID
     * @param destParentId 目标位置父节点ID（非必须）
     * @param sourceNodeId 原节点ID
     * @param options 拷贝属性
     * @return 新节点ID
     */
    String copyNodeToSpace(Long userId, String destSpaceId, String destParentId, String sourceNodeId, NodeCopyOptions options);

    /**
     * 数表导入
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @param opRo 请求参数
     * @return 节点vo
     * @throws IOException io exception
     */
    @Deprecated
    String importExcel(Long userId, String spaceId, ImportExcelOpRo opRo) throws IOException;

    /**
     * 多个数表导入
     *
     * @param excelReader Excel读取解析器
     * @param sheetsDataListener Excel监听器
     * @param readSheets 数表对象数组
     * @return excel数据对象
     */
    Map<String, List<List<Object>>> importMultipleSheetsByEasyExcel(ExcelReader excelReader, ExcelSheetsDataListener sheetsDataListener, List<ReadSheet> readSheets);

    /**
     * 单个数表导入
     *
     * @param excelReader Excel读取监听器
     * @param sheetsDataListener Excel监听器
     * @param readSheet 数表对象
     * @return excel数据对象
     */
    List<List<Object>> importSingleSheetByEasyExcel(ExcelReader excelReader, ExcelSheetsDataListener sheetsDataListener, ReadSheet readSheet);

    /**
     * 封禁或解封节点
     *
     * @param nodeId 节点ID
     * @param status 是否封禁(0:否,1:是)
     */
    void updateNodeBanStatus(String nodeId, Integer status);

    /**
     * 重复名称修改
     *
     * @param parentId 父节点ID
     * @param nodeType 节点类型
     * @param nodeName 节点原名称
     * @param nodeId 剔除的节点（修改时本身）
     * @return 修改后的名称
     */
    String duplicateNameModify(String parentId, int nodeType, String nodeName, String nodeId);

    /**
     * 判断节点以及所有子后代节点，是否包含成员字段
     *
     * @param nodeId 节点ID
     * @return boolean
     */
    boolean judgeAllSubNodeContainMemberFld(String nodeId);

    /**
     * 校验所有子后代节点的权限
     *
     * @param memberId 成员ID
     * @param nodeId 节点ID
     * @param role 要求的节点角色
     * @return AllSubNodeId
     */
    List<String> checkSubNodePermission(Long memberId, String nodeId, ControlRole role);

    /**
     * 数表节点复制之后的后续步骤，补齐link字段的属性和内容
     *
     * @param effect 节点复制的影响字段收集dto
     */
    void nodeCopyChangeset(NodeCopyEffectDTO effect);

    /**
     * 数表节点删除之后的后续步骤，将未删除的关联分列转换成文本字段
     *
     * @param nodeIds 删除的节点ID
     */
    void nodeDeleteChangeset(List<String> nodeIds);

    /**
     * 解析Excel文件
     *
     * @param userId 用户
     * @param uuid 用户外部id
     * @param spaceId 空间id
     * @param memberId 成员id
     * @param parentNodeId 父节点
     * @param fileName 文件名
     * @param fileSuffix 文件后缀
     * @param inputStream 文件流
     * @return 节点id
     */
    String parseExcel(Long userId, String uuid, String spaceId, Long memberId, String parentNodeId, String fileName, String fileSuffix, InputStream inputStream);

    /**
     * 解析CSV文件
     *
     * @param userId 用户
     * @param uuid 用户外部id
     * @param spaceId 空间id
     * @param memberId 成员id
     * @param parentNodeId 父节点
     * @param fileName 文件名
     * @param inputStream 文件流
     * @return 节点id
     */
    String parseCsv(Long userId, String uuid, String spaceId, Long memberId, String parentNodeId, String fileName, InputStream inputStream);

    /**
     * 特殊批量保存操作
     * 由Excel组装好数据，一次性事务全部提交数据库
     *
     * @param metaEntities 实体列表
     */
    void batchCreateDataSheet(NodeData data, List<NodeEntity> nodeEntities, List<DatasheetEntity> datasheetEntities, List<DatasheetMetaEntity> metaEntities, List<DatasheetRecordEntity> recordEntities);

    /**
     * 批量保存数表记录
     *
     * @param recordEntities 数表记录实体列表
     */
    void batchSaveDstRecords(List<DatasheetRecordEntity> recordEntities);

    /**
     * 获取节点额外信息
     *
     * @param nodeId 节点ID
     * @param spaceId 空间ID
     * @param extras 节点额外信息
     * @return ShowcaseVo.NodeExtra
     */
    ShowcaseVo.NodeExtra getNodeExtras(String nodeId, @Nullable String spaceId, @Nullable String extras);

    /**
     * 获取文件信息窗信息
     *
     * @param nodeId 节点ID
     * @return NodeInfoWindowVo
     */
    NodeInfoWindowVo getNodeWindowInfo(String nodeId);

    /**
     * 根据节点Id查询空间站信息
     *
     * @param nodeId 节点ID
     * @return 空间信息
     */
    NodeFromSpaceVo nodeFromSpace(String nodeId);

    /**
     * 根据节点和用户id查询节点名称
     *
     * @param nodeId 节点ID
     * @param userId 用户id
     * @return 节点名称
     */
    Optional<String> getNodeName(String nodeId, Long userId);

    /**
     * 如果节点是根节点，检查用户对根目录的操作是否符合全局安全设置-根目录管理的要求。
     *
     * @param memberId 用户成员id
     * @param spaceId 空间站id
     * @param nodeId 节点id
     */
    void checkEnableOperateNodeBySpaceFeature(Long memberId, String spaceId, String nodeId);

    /**
     * 检查用户对根目录的操作是否符合全局安全设置-根目录管理的要求。
     *
     * @param memberId 用户成员id
     * @param spaceId 空间站id
     */
    void checkEnableOperateRootNodeBySpaceFeature(Long memberId, String spaceId);

    /**
     * 节点是否在根目录中
     *
     * @param spaceId   空间ID
     * @param nodeId    节点ID
     * @return 节点是否在根目录中
     */
    boolean isNodeBelongRootFolder(String spaceId, String nodeId);
}
