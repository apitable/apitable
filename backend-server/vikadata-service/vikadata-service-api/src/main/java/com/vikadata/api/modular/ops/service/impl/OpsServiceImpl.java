package com.vikadata.api.modular.ops.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;

import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.ops.service.IOpsService;
import com.vikadata.api.modular.space.mapper.SpaceAssetMapper;
import com.vikadata.api.modular.template.service.ITemplateService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Product Operation System Service Implement Class
 * </p>
 *
 * @author Chambers
 * @date 2022/8/15
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
        List<Long> updatedAssetIds = iAssetService.updateAssetTemplateByIds(assetIds, !isReversed);
        if (CollUtil.isEmpty(updatedAssetIds)) {
            return;
        }
        spaceAssetMapper.updateIsTemplateByAssetIdIn(!isReversed, updatedAssetIds);
    }
}
