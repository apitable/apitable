package com.vikadata.api.modular.marketplace.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.vo.marketplace.MarketplaceSpaceAppVo;
import com.vikadata.entity.MarketplaceSpaceAppRelEntity;

/**
 *
 * <p>
 * 应用市场 内置集成应用接口
 * </p>
 *
 * @author Benson Cheung
 * @date 2021/3/31 下午1:46
 */
@Deprecated
public interface IMarketplaceAppService extends IService<MarketplaceSpaceAppRelEntity> {

    /**
     * 查询空间站的应用列表
     *
     * @param spaceId 空间ID
     * @return MarketplaceSpaceAppVo
     * @author Benson Cheung
     * @date 2021/03/31
     */
    List<MarketplaceSpaceAppVo> getSpaceAppList(String spaceId);

    /**
     * 获取空间开通的应用ID列表
     * 老版本数据，即将删除
     * @param spaceId 空间ID
     * @return 应用ID列表
     */
    List<String> getAppIdsBySpaceId(String spaceId);

    /**
     * 检查空间和应用是否开通
     * @param spaceId 空间ID
     * @param appId 应用ID
     * @return true | false
     */
    boolean checkBySpaceIdAndAppId(String spaceId, String appId);

    /**
     * 获取指定空间指定开通的应用实体
     * @param spaceId 空间ID
     * @param appId 应用ID
     * @return MarketplaceSpaceAppRelEntity
     */
    MarketplaceSpaceAppRelEntity getBySpaceIdAndAppId(String spaceId, String appId);

    /**
     * 移除空间的开通应用
     * @param spaceId 空间ID
     * @param appId 应用ID
     */
    void removeBySpaceIdAndAppId(String spaceId, String appId);

    /**
     * 开通应用
     *
     * @param appId     应用ID
     * @param spaceId   空间ID
     * @author Benson Cheung
     * @date 2021/04/06
     */
    void openSpaceApp(String spaceId, String appId);

    /**
     * 停用应用
     *
     * @param appId     应用ID
     * @param spaceId   空间ID
     * @author Benson Cheung
     * @date 2021/04/06
     */
    void stopSpaceApp(String spaceId, String appId);
}
