package com.vikadata.api.modular.ops.service;

/**
 * <p>
 * 产品运营系统 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2022/8/15
 */
public interface IOpsService {

    /**
     * 标志模板资源
     *
     * @param templateId    模板ID
     * @param isReversed    是否反向操作，即取消标志
     * @author Chambers
     * @date 2022/8/15
     */
    void markTemplateAsset(String templateId, Boolean isReversed);
}
