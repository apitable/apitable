package com.vikadata.api.modular.base.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.vikadata.api.model.vo.asset.AssetsAuditVo;
import com.vikadata.entity.AssetAuditEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 基础-附件审核表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-03-21
 */
public interface AssetAuditMapper extends BaseMapper<AssetAuditEntity> {

    /**
     * 获取需要人工审核的图片列表
     *
     * @return IPage<AssetsAuditVo>
     * @param page 分页参数
     * @author Benson Cheung
     * @date 2020/03/23
     */
    @InterceptorIgnore(illegalSql = "true") // suggestion、scenes 类型均只有几个，离散度不够，加索引意义不大
    IPage<AssetsAuditVo> getArtificialAssetsAuditList(Page<AssetsAuditVo> page);

    /**
     * 获取需要人工审核的图片列表
     *
     * @param assetFileUrl 附件路径
     * @param auditResultSuggestion  审核结果
     * @param auditorName  审核人姓名
     * @param auditorUserId  审核人userId
     * @return boolean 更新成功或者失败
     * @author Benson Cheung
     * @date 2020/03/23
     */
    boolean updateByAssetId(@Param("assetFileUrl") String assetFileUrl, @Param("auditResultSuggestion") String auditResultSuggestion,
                            @Param("auditorName") String auditorName, @Param("auditorUserId") String auditorUserId);
}
