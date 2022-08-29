package com.vikadata.api.modular.space.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.model.dto.space.NodeAssetDto;
import com.vikadata.api.model.dto.space.SpaceAssetDto;
import com.vikadata.api.model.ro.space.SpaceAssetOpRo;
import com.vikadata.entity.SpaceAssetEntity;

/**
 * <p>
 * 空间-附件表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
 */
public interface ISpaceAssetService extends IService<SpaceAssetEntity> {

    /**
     * 保存空间附件记录
     *
     * @param entities 实体列表
     * @author Chambers
     * @date 2020/3/6
     */
    void saveEntities(List<SpaceAssetEntity> entities);

    /**
     * 创建空间文件资源引用
     *
     * @param spaceId          空间ID
     * @param nodeId           节点ID
     * @param assetId          资源ID
     * @param assetChecksum    资源文件摘要
     * @param assetType        资源类型
     * @param originalFileName 资源源文件
     * @param fileSize         资源大小
     * @author Shawn Deng
     * @date 2020/6/3 20:49
     */
    void saveAssetInSpace(String spaceId, String nodeId, Long assetId, String assetChecksum, AssetType assetType, String originalFileName, long fileSize);

    /**
     * 编辑
     *
     * @param id   ID
     * @param cite 引用次数
     * @param type 类型
     * @author Chambers
     * @date 2020/3/21
     */
    void edit(Long id, Integer cite, Integer type);

    /**
     * 更改空间附件的逻辑删除状态
     *
     * @param nodeIds 数表节点ID列表
     * @param isDel   逻辑删除状态
     * @author Chambers
     * @date 2020/3/21
     */
    void updateIsDeletedByNodeIds(List<String> nodeIds, Boolean isDel);

    /**
     * 批量复制节点引用的空间附件资源
     *
     * @param newNodeMap  原节点ID - 目标节点ID Map
     * @param destSpaceId 目标节点的空间ID
     * @author Chambers
     * @date 2020/5/22
     */
    void copyBatch(Map<String, String> newNodeMap, String destSpaceId);

    /**
     * 处理节点的空间附件资源
     *
     * @param newNodeMap   原节点ID - 目标节点ID Map
     * @param destSpaceId  目标节点的空间ID
     * @param assetDtoList 节点的空间附件资源信息列表
     * @author Chambers
     * @date 2020/5/22
     */
    void processNodeAssets(Map<String, String> newNodeMap, String destSpaceId, List<NodeAssetDto> assetDtoList);

    /**
     * 空间附件资源引用数变更
     *
     * @param spaceId 空间ID
     * @param opRo    请求参数
     * @author Chambers
     * @date 2020/3/31
     */
    void datasheetAttachmentCite(String spaceId, SpaceAssetOpRo opRo);

    /**
     * 获取空间checksum的引用次数
     *
     * @param spaceId   空间ID
     * @param nodeId    目标节点ID
     * @param assetType 附件类型
     * @param assetIds assets表ID
     * @return Map<checksum, SpaceAssetDto>
     * @author zoe zheng
     * @date 2020/12/24 3:25 下午
     */
    Map<String, SpaceAssetDto> getSpaceAssetMapByAssetIdsAndType(String spaceId,
            String nodeId, AssetType assetType, List<Long> assetIds);

    /**
     * 批量创建
     *
     * @param entities SpaceAssetEntity
     * @return boolean
     * @author zoe zheng
     * @date 2020/12/28 8:45 下午
     */
    boolean createBatch(List<SpaceAssetEntity> entities);

    /**
     * 批量修改
     *
     * @param entities SpaceAssetEntity
     * @return boolean
     * @author zoe zheng
     * @date 2020/12/28 8:45 下午
     */
    boolean updateBatchById(List<SpaceAssetEntity> entities);
}
