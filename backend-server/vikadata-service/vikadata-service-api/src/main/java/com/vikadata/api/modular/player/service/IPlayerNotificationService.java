package com.vikadata.api.modular.player.service;

import java.io.IOException;
import java.util.List;

import cn.hutool.core.lang.Dict;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.component.notification.NotificationToTag;
import com.vikadata.api.model.dto.player.NotificationModelDto;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.ro.player.NotificationListRo;
import com.vikadata.api.model.ro.player.NotificationPageRo;
import com.vikadata.api.model.ro.player.NotificationRevokeRo;
import com.vikadata.api.model.vo.player.NotificationDetailVo;
import com.vikadata.api.model.vo.player.NotificationStatisticsVo;
import com.vikadata.entity.PlayerNotificationEntity;
import com.vikadata.system.config.notification.NotificationTemplate;

/**
 * <p>
 * 通知Notification表 服务类
 * </p>
 * oti
 *
 * @author Zoe Zheng
 * @since 2020-05-12
 */
public interface IPlayerNotificationService extends IService<PlayerNotificationEntity> {
    /**
     * 批量创建通知记录，发送通知
     *
     * @param roList 创建通知参数
     * @return 是否创建成功
     * @author zoe zheng
     * @date 2020/5/12 4:49 下午
     */
    boolean batchCreateNotify(List<NotificationCreateRo> roList);


    /**
     * 创建通知记录，发送通知
     *
     * @param ro 创建通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/4 4:27 下午
     */
    boolean createNotify(NotificationCreateRo ro);

    /**
     * 创建通知记录，发送通知
     *
     * @param template 通知模版
     * @param ro 创建通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/4 4:27 下午
     */
    boolean createUserNotify(NotificationTemplate template, NotificationCreateRo ro);

    /**
     * 创建通知记录，发送通知
     *
     * @param template 通知模版
     * @param ro 创建通知参数
     * @param toTag 通知用户标示
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/4 4:27 下午
     */
    boolean createMemberNotify(NotificationTemplate template, NotificationCreateRo ro,
            NotificationToTag toTag);

    /**
     * 创建成员提及通知
     *
     * @param toUserIds 通知的用户ID
     * @param template 通知模版
     * @param ro 通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/8 11:17 上午
     */
    boolean createMemberMentionedNotify(List<Long> toUserIds,
            NotificationTemplate template,
            NotificationCreateRo ro);

    /**
     * 创建系统通知
     *
     * @param template 通知模版
     * @param ro 创建通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/4 4:40 下午
     */
    boolean createAllUserNotify(NotificationTemplate template, NotificationCreateRo ro) throws IOException;

    /**
     * 创建记录并且发送通知, 不进行任何数据校验
     *
     * @param userIds 用户ID
     * @param template 通知模版
     * @param ro 创建通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/4 4:43 下午
     */
    boolean createNotifyWithoutVerify(List<Long> userIds, NotificationTemplate template,
            NotificationCreateRo ro);

    /**
     * 通知分页
     *
     * @param toUser 通知触达用户
     * @param notificationPageRo 分页请求参数
     * @return 分页体内容
     * @author zoe zheng
     * @date 2020/5/20 1:00 下午
     */
    List<NotificationDetailVo> pageList(NotificationPageRo notificationPageRo, LoginUserDto toUser);

    /**
     * 组装返回给客户端的数据
     *
     * @param dtos 通知的基本内容
     * @param uuid 用户的uuid
     * @return 消息具体内容
     * @author zoe zheng
     * @date 2020/5/23 7:52 下午
     */
    List<NotificationDetailVo> formatDetailVos(List<NotificationModelDto> dtos, String uuid);

    /**
     * 设置通知已读
     *
     * @param ids 通知的ID
     * @param isAll 是否全部
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/25 3:52 下午
     */
    boolean setNotificationIsRead(String[] ids, Integer isAll);

    /**
     * 用户消息统计
     *
     * @param userId 当前登陆用户ID
     * @return 统计的信息
     * @author zoe zheng
     * @date 2020/5/25 4:52 下午
     */
    NotificationStatisticsVo statistic(Long userId);

    /**
     * 删除消息
     *
     * @param ids 消息通知的ID数组
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/25 5:01 下午
     */
    boolean setDeletedIsTrue(String[] ids);

    /**
     * 批量创建消息
     *
     * @param notifyEntities 通知的entity
     * @param createEntities 创建的entity
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/27 1:16 下午
     */
    boolean createBatch(List<PlayerNotificationEntity> notifyEntities,
            List<PlayerNotificationEntity> createEntities);

    /**
     * 批量创建消息, 通知的entity和需要创建记录的entity一样
     *
     * @param notifyEntities 通知的entity
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/27 1:16 下午
     */
    boolean createBatch(List<PlayerNotificationEntity> notifyEntities);

    /**
     * 更新提及次数
     *
     * @param id 消息ID
     * @param notifyBody 消息的原body
     * @param body 新消息的body
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/27 1:22 下午
     */
    boolean modifyMentionTimes(Long id, String notifyBody, JSONObject body);

    /**
     * 用户通知列表
     *
     * @param notificationListRo 列表查询参数
     * @param toUser 当前登录用户
     * @return List<NotificationDetailVo>
     * @author zoe zheng
     * @date 2021/3/1 10:25 上午
     */
    List<NotificationDetailVo> list(NotificationListRo notificationListRo,
            LoginUserDto toUser);

    /**
     * 获取用户消息列表
     *
     * @param toUser 当前登录用户ID
     * @param isRead 是否已读
     * @return List<NotificationModelDto>
     * @author zoe zheng
     * @date 2021/3/1 10:39 上午
     */
    List<NotificationModelDto> getUserNotificationByTypeAndIsRead(Long toUser, Integer isRead);

    /**
     * 删除发送的通知
     *
     * @param ro 撤销通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/2 3:44 下午
     */
    boolean revokeNotification(NotificationRevokeRo ro);


    /**
     * 撤销所有用户的通知
     *
     * @param template 通知模版
     * @param ro 撤销通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/2 3:44 下午
     */
    boolean revokeAllUserNotification(NotificationTemplate template,
            NotificationRevokeRo ro);

    /**
     * 批量发送邮件提醒
     * to 定向用户
     *
     * @param template 消息模版
     * @param userIds 用户ID
     * @param dict 邮件额外参数
     * @author zoe zheng
     * @date 2022/2/23 14:23
     */
    void sendMailNotifyBatch(NotificationTemplate template, List<Long> userIds, Dict dict);
}
