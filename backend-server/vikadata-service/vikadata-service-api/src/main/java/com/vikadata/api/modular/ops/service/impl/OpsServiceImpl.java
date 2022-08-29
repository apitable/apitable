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
 * 产品运营系统 接口实现类
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
        // 获取模板内的所有节点ID
        List<String> nodeIds = iTemplateService.getNodeIdsByTemplateId(templateId);
        if (CollUtil.isEmpty(nodeIds)) {
            return;
        }
        // 查询节点引用的所有资源ID
        List<Long> assetIds = spaceAssetMapper.selectDistinctAssetIdByNodeIdIn(nodeIds);
        if (CollUtil.isEmpty(assetIds)) {
            return;
        }
        // 修改资源的模板状态
        iAssetService.updateAssetTemplateByIds(assetIds, !isReversed);
    }
}
