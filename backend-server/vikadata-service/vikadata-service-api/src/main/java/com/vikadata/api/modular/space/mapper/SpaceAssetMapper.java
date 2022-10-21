package com.vikadata.api.modular.space.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.space.NodeAssetDto;
import com.vikadata.api.model.dto.space.SpaceAssetDto;
import com.vikadata.entity.SpaceAssetEntity;

/**
 * <p>
 * 空间-附件表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
 */
public interface SpaceAssetMapper extends BaseMapper<SpaceAssetEntity> {

    /**
     * 更改空间附件的逻辑删除状态
     *
     * @param nodeIds 节点ID列表
     * @param isDel   逻辑删除状态
     * @return 修改个数
     * @author Chambers
     * @date 2020/3/7
     */
    int updateIsDeletedByNodeIds(@Param("list") List<String> nodeIds, @Param("isDel") Boolean isDel);

    /**
     * 查询节点引用的资源ID
     *
     * @param nodeIds 节点ID列表
     * @return assetIds
     * @author Chambers
     * @date 2022/8/15
     */
    List<Long> selectDistinctAssetIdByNodeIdIn(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * 获取ID和引用次数
     *
     * @param spaceId 空间ID
     * @param nodeId  数表节点ID
     * @param assetId 基础附件资源ID
     * @return dto
     * @author Chambers
     * @date 2020/3/21
     */
    SpaceAssetDto selectDto(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId, @Param("assetId") Long assetId);

    /**
     * 获取ID、引用次数和对应token
     *
     * @param spaceId   空间ID
     * @param nodeId    数表节点ID
     * @param type      附件类型
     * @param assetIds assets表ID
     * @return dto
     * @author Chambers
     * @date 2020/3/31
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceAssetDto> selectDtoByAssetIdsAndType(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId,
            @Param("type") Integer type, @Param("assetIds") List<Long> assetIds);

    /**
     * 获取节点对应的空间附件资源信息
     *
     * @param nodeIds 节点ID列表
     * @return Asset 列表
     * @author Chambers
     * @date 2020/4/30
     */
    List<NodeAssetDto> selectNodeAssetDto(@Param("list") List<String> nodeIds);

    /**
     * 批量插入
     *
     * @param entities 实体
     * @return 执行结果
     * @author Chambers
     * @date 2020/5/26
     */
    int insertBatch(@Param("entities") List<SpaceAssetEntity> entities);

    /**
     * 判断附件在空间中是否存在
     *
     * @param spaceId  空间ID
     * @param checksum MD5摘要
     * @return 数量
     * @author Chambers
     * @date 2020/6/17
     */
    Integer countBySpaceIdAndAssetChecksum(@Param("spaceId") String spaceId, @Param("checksum") String checksum);

    /**
     * 修改指定节点、对某一附件的引用数
     *
     * @param nodeId 数表节点ID
     * @param token  基础附件资源file_url
     * @param offset 偏移量
     * @return 执行结果
     * @author Chambers
     * @date 2020/7/2
     */
    int updateCiteByNodeIdAndToken(@Param("nodeId") String nodeId, @Param("token") String token, @Param("offset") int offset);

    /**
     * 查询空间引用资源的文件大小集合
     *
     * @param spaceId 空间ID
     * @return 文件大小
     * @author Shawn Deng
     * @date 2021/1/6 15:43
     */
    List<Integer> selectFileSizeBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 删除空间资源引用记录（物理删除）
     *
     * @param ids 表ID列表
     * @return 执行结果数
     * @author Chambers
     * @date 2021/10/28
     */
    int deleteBatchByIds(@Param("ids") Collection<Long> ids);

    /**
     * update template status by asset ids
     *
     * @param isTemplate        updated template status
     * @param assetChecksums    asset checksum list
     * @return affected rows count
     * @author Chambers
     * @date 2022/10/13
     */
    int updateIsTemplateByAssetChecksumIn(@Param("isTemplate") Boolean isTemplate, @Param("assetChecksums") Collection<String> assetChecksums);

}
