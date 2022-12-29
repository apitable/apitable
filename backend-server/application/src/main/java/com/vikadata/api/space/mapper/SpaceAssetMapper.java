package com.vikadata.api.space.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.space.dto.NodeAssetDTO;
import com.vikadata.api.space.dto.SpaceAssetDTO;
import com.vikadata.entity.SpaceAssetEntity;

public interface SpaceAssetMapper extends BaseMapper<SpaceAssetEntity> {

    /**
     * @param nodeIds node ids
     * @param isDel   logical deletion status
     * @return affected rows
     */
    int updateIsDeletedByNodeIds(@Param("list") List<String> nodeIds, @Param("isDel") Boolean isDel);

    /**
     * @param nodeIds node ids
     * @return assetIds
     */
    List<Long> selectDistinctAssetIdByNodeIdIn(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * get id and cte, type
     *
     * @param spaceId space id
     * @param nodeId node id
     * @param assetId asset id
     * @return dto
     */
    SpaceAssetDTO selectDto(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId, @Param("assetId") Long assetId);

    /**
     * get id and cte, token
     *
     * @param spaceId space id
     * @param nodeId node id
     * @param type      file type
     * @param assetIds asset ID
     * @return dto
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceAssetDTO> selectDtoByAssetIdsAndType(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId,
            @Param("type") Integer type, @Param("assetIds") List<Long> assetIds);

    /**
     * Obtain information about the attachment resources of a node
     *
     * @param nodeIds node ids
     * @return Assets
     */
    List<NodeAssetDTO> selectNodeAssetDto(@Param("list") List<String> nodeIds);

    /**
     * @param entities asset
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<SpaceAssetEntity> entities);

    /**
     * Determine whether the attachment exists in the space
     *
     * @param spaceId space id
     * @param checksum MD5
     * @return the row amount
     */
    Integer countBySpaceIdAndAssetChecksum(@Param("spaceId") String spaceId, @Param("checksum") String checksum);

    /**
     * Modifies the number of references to an attachment on a specified node
     *
     * @param nodeId node id
     * @param token  asset file_url
     * @param offset offset
     * @return affected rows
     */
    int updateCiteByNodeIdAndToken(@Param("nodeId") String nodeId, @Param("token") String token, @Param("offset") int offset);

    /**
     * @param spaceId space id
     * @return file sizes
     */
    List<Integer> selectFileSizeBySpaceId(@Param("spaceId") String spaceId);

    /**
     * @param ids id
     * @return affected rows
     */
    int deleteBatchByIds(@Param("ids") Collection<Long> ids);

    /**
     * update template status by asset ids
     *
     * @param isTemplate        updated template status
     * @param assetChecksums    asset checksum list
     * @return affected rows count
     */
    int updateIsTemplateByAssetChecksumIn(@Param("isTemplate") Boolean isTemplate, @Param("assetChecksums") Collection<String> assetChecksums);

}
