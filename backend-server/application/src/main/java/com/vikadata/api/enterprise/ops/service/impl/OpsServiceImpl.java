package com.vikadata.api.enterprise.ops.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;

import com.vikadata.api.enterprise.ops.service.IOpsService;
import com.vikadata.api.asset.service.IAssetService;
import com.vikadata.api.space.mapper.SpaceAssetMapper;
import com.vikadata.api.template.service.ITemplateService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Product Operation System Service Implement Class
 * </p>
 */
@Service
public class OpsServiceImpl implements IOpsService {

    @Resource
    private IAssetService iAssetService;

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private ITemplateService iTemplateService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markTemplateAsset(String templateId, Boolean isReversed) {
        // get all node IDs inside the template
        List<String> nodeIds = iTemplateService.getNodeIdsByTemplateId(templateId);
        if (CollUtil.isEmpty(nodeIds)) {
            return;
        }
        // query all resource IDs referenced by a node
        List<Long> assetIds = spaceAssetMapper.selectDistinctAssetIdByNodeIdIn(nodeIds);
        if (CollUtil.isEmpty(assetIds)) {
            return;
        }
        // modify the template state of resource
        List<String> updatedAssetChecksums = iAssetService.updateAssetTemplateByIds(assetIds, !isReversed);
        if (CollUtil.isEmpty(updatedAssetChecksums)) {
            return;
        }
        spaceAssetMapper.updateIsTemplateByAssetChecksumIn(!isReversed, updatedAssetChecksums);
    }
}
