package com.vikadata.api.modular.player.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.player.NotificationModelDto;
import com.vikadata.api.model.ro.player.NotificationPageRo;
import com.vikadata.api.model.ro.player.NotificationRevokeRo;
import com.vikadata.entity.PlayerNotificationEntity;

/**
 * <p>
 * 通知Notification表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-05-12
 */
public interface PlayerNotificationMapper extends BaseMapper<PlayerNotificationEntity> {
    /**
     * 获取通知列表
     *
     * @param notificationPageRo 参数ro
     * @param toUser             用户Id
     * @param totalCount         总条数
     * @return dto
     * @author zoe zheng
     * @date 2020/5/20 11:01 上午
     */
    List<NotificationModelDto> selectPlayerNotificationPage(
            @Param("notificationPageRo") NotificationPageRo notificationPageRo, @Param("toUser") Long toUser,
            @Param("totalCount") Integer totalCount);

    /**
     * notification批量写入
     *
     * @param notificationEntities 实体列表
     * @return 执行结果数
     * @author zoe zheng
     * @date 2020/5/23 2:51 下午
     */
    int insertBatch(@Param("notificationEntities") List<PlayerNotificationEntity> notificationEntities);

    /**
     * 根据ID设置消息已读
     *
     * @param ids ID列表
     * @return 执行结果
     * @author zoe zheng
     * @date 2020/5/25 3:57 下午
     */
    boolean updateReadIsTrueByIds(@Param("ids") String[] ids);

    /**
     * 将用户的消息全部设置为已读
     *
     * @param toUser 接收用户
     * @return 执行结果
     * @author zoe zheng
     * @date 2020/5/25 4:22 下午
     */
    boolean updateReadIsTrueByUserId(@Param("toUser") Long toUser);

    /**
     * 根据用户ID,查询isRead=1的条数
     *
     * @param toUser 接收用户
     * @param isRead 是否已读
     * @return count
     * @author zoe zheng
     * @date 2020/5/25 4:37 下午
     */
    Integer selectCountByUserIdAndIsRead(@Param("toUser") Long toUser, @Param("isRead") Integer isRead);

    /**
     * 根据用户ID，查询总条数
     *
     * @param toUser 接收用户
     * @return count
     * @author zoe zheng
     * @date 2020/5/25 4:43 下午
     */
    Integer selectTotalCountByUserId(@Param("toUser") Long toUser);

    /**
     * 根据消息ID删除消息
     *
     * @param ids ID列表
     * @return 执行结果
     * @author zoe zheng
     * @date 2020/5/25 4:57 下午
     */
    boolean deleteNotificationByIds(@Param("ids") String[] ids);

    /**
     * 根据ID查找body
     *
     * @param id ID
     * @return body
     * @author zoe zheng
     * @date 2020/5/27 12:01 下午
     */
    String selectNotifyBodyById(@Param("id") Long id);

    /**
     * 更新消息体
     *
     * @param id   ID
     * @param body 消息体
     * @return 执行结果
     * @author zoe zheng
     * @date 2020/5/27 1:31 下午
     */
    boolean updateNotifyBodyById(@Param("id") Long id, @Param("body") String body);

    /**
     * 根据request查询总数
     *
     * @param notificationPageRo 用户通知列表参数
     * @param toUser             接收用户
     * @return count
     * @author zoe zheng
     * @date 2020/6/1 7:18 下午
     */
    Integer selectTotalCountByRoAndToUser(@Param("notificationPageRo") NotificationPageRo notificationPageRo,
            @Param("toUser") Long toUser);

    /**
     * 修改消息体，替换指定键对应的值
     *
     * @param id  ID
     * @param key key
     * @param val value
     * @return 执行结果数
     * @author Chambers
     * @date 2020/11/7
     */
    Integer updateNotifyBodyByIdAndKey(@Param("id") Long id, @Param("key") String key, @Param("val") Integer val);

    /**
     * 获取消息dto列表
     *
     * @param type 消息类型
     * @param isRead 是否已读
     * @param toUser 用户ID
     * @return List<NotificationModelDto>
     * @author zoe zheng
     * @date 2021/3/1 10:30 上午
     */
    List<NotificationModelDto> selectDtoByTypeAndIsRead(@Param("toUser") Long toUser, @Param("isRead") Integer isRead);

    /**
     *  根据用户ID和templateId批量删除
     *
     * @param userIds 用户ID
     * @param notifyType 通知类型
     * @param templateId 模版ID
     * @param revokeRo 撤销额外参数
     * @return int
     * @author zoe zheng
     * @date 2021/3/2 5:50 下午
     */
    int updateBatchByUserIdsAndTemplateId(@Param("userIds") List<Long> userIds,
            @Param("notifyType") String notifyType,
            @Param("templateId") String templateId,
            @Param("revokeRo") NotificationRevokeRo revokeRo);
}
