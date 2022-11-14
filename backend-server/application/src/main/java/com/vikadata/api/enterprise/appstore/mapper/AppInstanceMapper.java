package com.vikadata.api.enterprise.appstore.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AppInstanceEntity;

/**
 * Application instance mapper
 */
public interface AppInstanceMapper extends BaseMapper<AppInstanceEntity> {

    /**
     * Query by space and application
     * 
     * @param spaceId Space ID
     * @param appId App ID
     * @return AppInstanceEntity
     */
    AppInstanceEntity selectBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);

    /**
     * Query by space and application
     *
     * @param spaceId Space ID
     * @return AppInstanceEntity
     */
    List<AppInstanceEntity> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query according to Application instance ID
     *
     * @param appInstanceId Application instance ID
     * @return AppInstanceEntity
     */
    AppInstanceEntity selectByAppInstanceId(@Param("appInstanceId") String appInstanceId);

    /**
     * Delete according to Application instance ID
     *
     * @param appInstanceId Application instance ID
     * @return Number of executed pieces
     */
    int deleteByAppInstanceId(@Param("appInstanceId") String appInstanceId);

    /**
     * Query by application key
     *
     * @param appKey Application key of application instance
     * @return AppInstanceEntity
     */
    Integer selectCountByAppKey(@Param("appKey") String appKey);

    /**
     * Query by application key
     *
     * @param appInstanceId Application instance ID
     * @param appKey Application key of application instance
     * @return AppInstanceEntity
     */
    Integer selectCountByAppInstanceIdAndAppKey(@Param("appInstanceId") String appInstanceId, @Param("appKey") String appKey);
}
