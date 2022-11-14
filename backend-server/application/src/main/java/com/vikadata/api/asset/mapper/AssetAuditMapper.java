package com.vikadata.api.asset.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.asset.vo.AssetsAuditVo;
import com.vikadata.entity.AssetAuditEntity;

/**
 * Basics - Attachment Audit Form Mapper Interface
 */
public interface AssetAuditMapper extends BaseMapper<AssetAuditEntity> {

    /**
     * get a list of images that need human review
     *
     * @return IPage<AssetsAuditVo>
     * @param page pagination parameters
     */
    @InterceptorIgnore(illegalSql = "true")
    // There are only a few types of suggestions and scenes, the dispersion is not enough, and the indexing is not meaningful
    IPage<AssetsAuditVo> getArtificialAssetsAuditList(Page<AssetsAuditVo> page);

    /**
     * Get a list of images that need human review
     *
     * @param assetFileUrl attachment path
     * @param auditResultSuggestion  audit results
     * @param auditorName  Reviewer's name
     * @param auditorUserId  Reviewer user Id
     * @return boolean Update succeeded or failed
     */
    boolean updateByAssetId(@Param("assetFileUrl") String assetFileUrl, @Param("auditResultSuggestion") String auditResultSuggestion,
            @Param("auditorName") String auditorName, @Param("auditorUserId") String auditorUserId);
}
