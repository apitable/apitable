package com.vikadata.api.modular.base.service.impl;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.attach.AssetUploadSource;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.ro.asset.AssetQiniuUploadCallbackBody;
import com.vikadata.api.modular.base.mapper.AssetMapper;
import com.vikadata.api.modular.base.mapper.DeveloperAssetMapper;
import com.vikadata.api.modular.base.service.IAssetCallbackService;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 基础-附件回调 服务实现类
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:46:25
 */
@Slf4j
@Service
public class AssetCallbackServiceImpl implements IAssetCallbackService {

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private DeveloperAssetMapper developerAssetMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void qiniuCallback(AssetQiniuUploadCallbackBody body) {
        AssetUploadSource uploadSource = AssetUploadSource.of(body.getUploadSource());
        switch (uploadSource) {
            case WIDGET_STATIC:
                this.completeWidgetStaticUpload(body);
                break;
        }
    }

    private void completeWidgetStaticUpload(AssetQiniuUploadCallbackBody body) {
        Long assetId = body.getUploadAssetId();
        Long developerAssetId = body.getUploadDeveloperAssetId();
        Long fsize = body.getFsize();

        boolean flag = SqlHelper.retBool(assetMapper.updateFileSizeById(assetId, fsize));
        flag &= SqlHelper.retBool(developerAssetMapper.updateFileSizeById(developerAssetId, fsize));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

}
