package com.vikadata.api.modular.appstore.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AppInstanceEntity;

/**
 * 应用实例 Mapper
 * @author Shawn Deng
 * @date 2022-01-17 15:22:06
 */
public interface AppInstanceMapper extends BaseMapper<AppInstanceEntity> {

    /**
     * 根据空间和应用查询
     * @param spaceId 空间ID
     * @param appId 应用ID
     * @return AppInstanceEntity
     */
    AppInstanceEntity selectBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);

    /**
     * 根据空间和应用查询
     * @param spaceId 空间ID
     * @return AppInstanceEntity
     */
    List<AppInstanceEntity> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 根据应用实例ID查询
     * @param appInstanceId 应用实例ID
     * @return AppInstanceEntity
     */
    AppInstanceEntity selectByAppInstanceId(@Param("appInstanceId") String appInstanceId);

    /**
     * 根据应用实例ID删除
     * @param appInstanceId 应用实例ID
     * @return 执行条数
     */
    int deleteByAppInstanceId(@Param("appInstanceId") String appInstanceId);

    /**
     * 根据应用key查询
     * @param appKey 应用实例的应用key
     * @return AppInstanceEntity
     */
    Integer selectCountByAppKey(@Param("appKey") String appKey);

    /**
     * 根据应用key查询
     * @param appInstanceId 应用实例ID
     * @param appKey 应用实例的应用key
     * @return AppInstanceEntity
     */
    Integer selectCountByAppInstanceIdAndAppKey(@Param("appInstanceId") String appInstanceId, @Param("appKey") String appKey);
}
