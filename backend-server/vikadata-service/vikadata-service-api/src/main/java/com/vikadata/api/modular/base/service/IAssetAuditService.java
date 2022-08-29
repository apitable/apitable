package com.vikadata.api.modular.base.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.ro.asset.AssetsAuditRo;
import com.vikadata.api.model.ro.asset.AttachAuditCallbackRo;
import com.vikadata.api.model.vo.asset.AssetsAuditVo;
import com.vikadata.entity.AssetAuditEntity;

/**
 * <p>
 * 资源审核表 服务类
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-03-21
 */
public interface IAssetAuditService extends IService<AssetAuditEntity> {

    /**
     * 创建资源审核记录
     *
     * @param assetId    资源ID
     * @param checksum   资源摘要
     * @param uploadPath 资源存储路径
     * @author Shawn Deng
     * @date 2020/6/2 17:41
     */
    void create(Long assetId, String checksum, String uploadPath);

    /**
     * 回调审核结果处理
     *
     * @param result 回调结果
     * @author Benson Cheung
     * @date 2020/3/20
     */
    void auditCallback(AttachAuditCallbackRo result);

    /**
     * 查询待人工审核图片列表
     *
     * @param page 分页参数
     * @return List<AssetsAuditVo> 回调结果
     * @author Benson Cheung
     * @date 2020/3/20
     */
    IPage<AssetsAuditVo> readReviews(Page page);

    /**
     * 提交审核结果
     *
     * @param results 提交审核结果
     * @author Benson Cheung
     * @date 2020/3/20
     */
    void submitAuditResult(AssetsAuditRo results);
}
