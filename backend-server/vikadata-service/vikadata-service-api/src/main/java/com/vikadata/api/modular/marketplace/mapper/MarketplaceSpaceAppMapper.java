package com.vikadata.api.modular.marketplace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.MarketplaceSpaceAppRelEntity;

/**
 * <p>
 * 应用市场-空间站内置应用 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2021/03/31
 */
public interface MarketplaceSpaceAppMapper extends BaseMapper<MarketplaceSpaceAppRelEntity> {

    /**
     * 查询空间站的内置集成应用列表dto
     *
     * @param spaceId      空间ID
     * @return 查看空间站的内置应用ID列表
     * @author Benson Cheung
     * @date 2021/3/31
     */
    @Deprecated
    List<String> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间站的内置集成应用列表dto
     *
     * @param spaceId      空间ID
     * @param appId   应用ID
     * @return 查看空间站的内置应用ID列表
     * @author Benson Cheung
     * @date 2021/3/31
     */
    @Deprecated
    Integer selectCountBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);

    /**
     * 停用应用
     *
     * @param spaceId 空间ID
     * @param appId   应用ID
     * @return 执行结果数
     * @author Benson Cheung
     * @date 2021/3/31
     */
    @Deprecated
    int deleteBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);

    /**
     * 根据空间ID和应用ID查询
     * @param spaceId 空间ID
     * @param appId 应用ID
     * @return MarketplaceSpaceAppRelEntity
     */
    MarketplaceSpaceAppRelEntity selectBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);
}
