package com.vikadata.api.modular.base.service.impl;

import java.net.URL;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.ConstProperties.OssBucketInfo;
import com.vikadata.api.constants.AssetsPublicConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.attach.AssetAuditType;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.ro.asset.AssetsAuditOpRo;
import com.vikadata.api.model.ro.asset.AssetsAuditRo;
import com.vikadata.api.model.ro.asset.AttachAuditCallbackRo;
import com.vikadata.api.model.ro.asset.AttachAuditItemsRo;
import com.vikadata.api.model.ro.asset.AttachAuditPulpResultRo;
import com.vikadata.api.model.vo.asset.AssetsAuditVo;
import com.vikadata.api.modular.base.mapper.AssetAuditMapper;
import com.vikadata.api.modular.base.service.IAssetAuditService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AssetAuditEntity;
import com.vikadata.integration.oss.OssClientTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.UserException.DING_USER_UNKNOWN;

/**
 * <p>
 * 基础-附件审核表 服务实现类
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-03-21
 */
@Service
@Slf4j
public class AssetAuditServiceImpl extends ServiceImpl<AssetAuditMapper, AssetAuditEntity> implements IAssetAuditService {

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private AssetAuditMapper assetAuditMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public void create(Long assetId, String checksum, String uploadPath) {
        AssetAuditEntity assetAudit = AssetAuditEntity.builder()
                .assetId(assetId)
                .assetChecksum(checksum)
                .assetFileUrl(uploadPath).build();
        boolean createFlag = save(assetAudit);
        ExceptionUtil.isTrue(createFlag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void auditCallback(AttachAuditCallbackRo result) {
        log.info("OSS云存储机器审核回调结果处理");
        if (ObjectUtil.isNotNull(result) && result.getCode() == 0) {
            String fileUrl = result.getInputKey();
            //根据Key查询asset的图片记录
            QueryWrapper<AssetAuditEntity> wrapper = new QueryWrapper<AssetAuditEntity>()
                    .eq("asset_file_url", fileUrl);
            AssetAuditEntity assetAudit = this.getOne(wrapper);
            List<AttachAuditItemsRo> itemList = result.getItems();
            for (AttachAuditItemsRo items : itemList) {
                //获取审核结果保存数据库
                AttachAuditPulpResultRo attachAuditPulpResult = items.getResult().getResult().getScenes().getPulp();
                if (ObjectUtil.isNotNull(assetAudit)) {
                    assetAudit.setAuditResultSuggestion(attachAuditPulpResult.getSuggestion())
                            .setAuditScenes(attachAuditPulpResult.getResult().getLabel())
                            .setAuditResultScore(attachAuditPulpResult.getResult().getScore());
                    this.updateById(assetAudit);
                }
                //处理block类型图片，操作OSS云存储图片替换为【占位图】
                replaceOssImage(attachAuditPulpResult.getSuggestion(), fileUrl);
            }
        }
    }

    @Override
    public IPage<AssetsAuditVo> readReviews(Page page) {
        log.info("查询需人工审核的图片列表");
        IPage<AssetsAuditVo> assetsAuditList = assetAuditMapper.getArtificialAssetsAuditList(page);
        return assetsAuditList;
    }

    @Override
    public void submitAuditResult(AssetsAuditRo results) {
        log.info("提交人工审核结果");
        //查询session中的钉钉会员信息
        String auditorUserId = SessionContext.getDingtalkUserId();
        String auditorName = SessionContext.getDingtalkUserName();
        ExceptionUtil.isNotNull(auditorUserId, DING_USER_UNKNOWN);
        List<AssetsAuditOpRo> assetlist = results.getAssetlist();
        String[] urls = new String[assetlist.size()];
        String resourceUrl = constProperties.getOssBucketByAsset().getResourceUrl();
        int i = 0;
        if (ObjectUtil.isAllNotEmpty(assetlist)) {
            for (AssetsAuditOpRo op : assetlist) {
                //更新数据库人工审核结果
                boolean flag = assetAuditMapper.updateByAssetId(op.getAssetFileUrl(), op.getAuditResultSuggestion(), auditorName, auditorUserId);
                ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
                //若人工审核结果不通过，替换OSS云存储的图片为【占位图】
                replaceOssImage(op.getAuditResultSuggestion(), op.getAssetFileUrl());
                urls[i] = resourceUrl + "/" + op.getAssetFileUrl();
                i++;
            }
            //刷新CDN缓存
            // String bucketName = constProperties.getOssBucketName();
            // ossTemplate.refreshCdn(bucketName, urls);
        }
    }

    public void replaceOssImage(String suggestion, String fileUrl) {
        //处理图片机器审核后的结果
        if (StrUtil.equals(suggestion, AssetAuditType.BLOCK.getValue())) {
            // 防止图片审核异常多次回调，造成重复覆盖上传
            Boolean lock = redisTemplate.opsForValue().setIfAbsent(fileUrl, 1, 2, TimeUnit.HOURS);
            if (BooleanUtil.isFalse(lock)) {
                return;
            }
            OssBucketInfo asset = constProperties.getOssBucketByAsset();
            //block类型图片，操作OSS云存储图片替换为【占位图】，属于违规图片
            String unNameImage = asset.getResourceUrl() + AssetsPublicConstants.ASSETS_PUBLIC_PLACEHOLDER;
            try {
                URL url = new URL(unNameImage);
                String bucketName = asset.getBucketName();
                ossTemplate.upload(bucketName, url.openStream(), fileUrl);
                //刷新CDN缓存
                String fullFileUrl = asset.getResourceUrl() + "/" + fileUrl;
                String[] urls = { fullFileUrl };
                ossTemplate.refreshCdn(bucketName, urls);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
