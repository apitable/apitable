package com.vikadata.api.modular.player.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.PlayerActivityEntity;

/**
 * <p>
 * Player - Activity Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/6/8
 */
public interface PlayerActivityMapper extends BaseMapper<PlayerActivityEntity> {

    /**
     * 查询动作集合体
     *
     * @param userId 用户ID
     * @return 动作集合体（json）
     * @author Chambers
     * @date 2020/6/9
     */
    String selectActionsByUserId(@Param("userId") Long userId);

    /**
     * 查询数量
     *
     * @param userId 用户ID
     * @return count
     * @author Chambers
     * @date 2020/6/9
     */
    Integer countByUserId(@Param("userId") Long userId);

    /**
     * 查询动作集合体中指定键，对应的值
     *
     * @param userId 用户ID
     * @param key    键
     * @return value
     * @author Chambers
     * @date 2020/6/9
     */
    Object selectActionsVal(@Param("userId") Long userId, @Param("key") String key);

    /**
     * 更改动作集合体，插入键值对
     *
     * @param userIds 用户ID 列表
     * @param key    键
     * @param value  值
     * @return 修改数
     * @author Chambers
     * @date 2020/6/9
     */
    int updateActionsByJsonSet(@Param("userIds") List<Long> userIds, @Param("key") String key, @Param("value") Object value);

    /**
     * 更改动作集合体，替换指定键对应的值
     *
     * @param userId 用户ID
     * @param key    键
     * @param value  值
     * @return 修改数
     * @author Chambers
     * @date 2020/6/9
     */
    int updateActionsReplaceByUserId(@Param("userId") Long userId, @Param("key") String key, @Param("value") Object value);

    /**
     * 更改动作集合体，删除指定键对应的值
     *
     * @param userId 用户ID
     * @param key    键
     * @return 修改数
     * @author Chambers
     * @date 2020/9/21
     */
    int updateActionsRemoveByUserId(@Param("userId") Long userId, @Param("key") String key);

    /**
     * 更改指定用户记录
     *
     * @param userId 用户ID
     * @param act    动作集合体
     * @return 修改数
     */
    int updateActionsByUserId(@Param("userId") Long userId, @Param("act") String act);
}
