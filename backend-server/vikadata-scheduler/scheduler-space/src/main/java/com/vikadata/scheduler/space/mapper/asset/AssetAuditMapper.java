package com.vikadata.scheduler.space.mapper.asset;

import com.vikadata.scheduler.space.model.AssetsAuditDto;

import java.util.List;

/**
 * <p>
 * 基础-附件审核表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-03-21
 */
public interface AssetAuditMapper{

    /**
     * 获取需要人工审核的图片列表
     *
     * @return List<AssetsAuditDto> 图片列表
     * @author Benson Cheung
     * @date 2020/03/23
     */
    List<AssetsAuditDto> getArtificialAssetsAuditList();

}
