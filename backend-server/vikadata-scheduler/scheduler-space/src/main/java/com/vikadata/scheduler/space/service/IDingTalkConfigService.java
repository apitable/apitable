package com.vikadata.scheduler.space.service;

/**
 * <p>
 * 钉钉应用服务
 * </p>
 * @author zoe zheng
 * @date 2021/7/26 6:54 下午
 */
public interface IDingTalkConfigService {

    /**
     * 保存钉钉自建应用->服务商模式的配置
     *
     * @param dstId 配置表ID
     * @author zoe zheng
     * @date 2021/7/26 6:54 下午
     */
    void saveDingTalkAgentAppConfig(String dstId);

    /**
     * 保存钉钉商品的配置
     * @param dstId 配置表ID
     * @param featureDstId 属性配置表ID
     * @author zoe zheng
     * @date 2021/10/26 17:30
     */
    void saveDingTalkGoodsConfig(String token, String host, String dstId, String featureDstId);

    /**
     * 保存钉钉搭icon的配置
     *
     * @param dstId 模版配置表ID
     * @param viewId 视图ID
     * @author zoe zheng
     * @date 2022/1/4 11:05 AM
     */
    void saveDingTalkDaTemplateConfig(String dstId, String viewId);
}
