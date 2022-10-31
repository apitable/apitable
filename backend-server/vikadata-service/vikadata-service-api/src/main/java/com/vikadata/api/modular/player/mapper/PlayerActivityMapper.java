package com.vikadata.api.modular.player.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.PlayerActivityEntity;

/**
 * <p>
 * Player Activity Mapper
 * </p>
 */
public interface PlayerActivityMapper extends BaseMapper<PlayerActivityEntity> {

    /**
     * Query actions
     */
    String selectActionsByUserId(@Param("userId") Long userId);

    /**
     * Query count
     */
    Integer countByUserId(@Param("userId") Long userId);

    /**
     * Query the specified key and corresponding value in the action aggregate
     */
    Object selectActionsVal(@Param("userId") Long userId, @Param("key") String key);

    /**
     * Change action collection, insert key-value pair
     */
    int updateActionsByJsonSet(@Param("userIds") List<Long> userIds, @Param("key") String key, @Param("value") Object value);

    /**
     * Change the action aggregate, replacing the value corresponding to the specified key
     */
    int updateActionsReplaceByUserId(@Param("userId") Long userId, @Param("key") String key, @Param("value") Object value);

    /**
     * Change the action aggregate and delete the value corresponding to the specified key
     */
    int updateActionsRemoveByUserId(@Param("userId") Long userId, @Param("key") String key);

    /**
     * Change user actions
     */
    int updateActionsByUserId(@Param("userId") Long userId, @Param("act") String act);
}
