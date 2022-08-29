package com.vikadata.api.component.notification;

import java.util.List;
import java.util.Map;

import cn.hutool.json.JSONObject;

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.player.NotificationModelDto;
import com.vikadata.api.model.dto.space.BaseSpaceInfoDto;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.vo.player.NotificationDetailVo;
import com.vikadata.api.model.vo.player.PlayerBaseVo;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.system.config.notification.NotificationTemplate;

/**
 * <p>
 * 通知模版工厂类
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/13 10:48 上午
 */
public interface INotificationFactory {
    /**
     * 根据模版ID获取templateInfo
     *
     * @param templateId 消息的模版ID
     * @return 消息体
     * @author zoe zheng
     * @date 2020/5/13 10:52 上午
     */
    NotificationTemplate getTemplateById(String templateId);

    /**
     * 组装消息来源fromUser的数据
     *
     * @param fromUserId 消息来源的用户ID
     * @param spaceId 空间ID
     * @param renderMap 查出的数据
     * @return 用户的基本数据
     * @author zoe zheng
     * @date 2020/5/26 4:36 下午
     */
    PlayerBaseVo formatFromUser(Long fromUserId, String spaceId, NotificationRenderMap renderMap);

    /**
     * 组装node数据
     *
     * @param node 节点基本信息
     * @return 节点的基本信息
     * @author zoe zheng
     * @date 2020/5/26 4:37 下午
     */
    NotificationDetailVo.Node formatNode(NodeBaseInfoDTO node);

    /**
     * 组装space的数据
     *
     * @param space 空间基本信息
     * @return 空间的基本信息
     * @author zoe zheng
     * @date 2020/5/26 4:42 下午
     */
    NotificationDetailVo.Space formatSpace(BaseSpaceInfoDto space);

    /**
     * 判断消息发送需要统计次数的锁是否存在
     *
     * @param key redis的key
     * @param notificationId 消息通知的ID
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/26 5:39 下午
     */
    boolean delayLock(String key, Long notificationId);

    /**
     * 获取消息发送需要统计次数的key
     *
     * @param toUserId 消息触达用户ID
     * @param ro 消息参数
     * @return redis的key
     * @author zoe zheng
     * @date 2020/5/26 5:39 下午
     */
    String getDelayLockKey(String toUserId, NotificationCreateRo ro);

    /**
     * 从redis中获取消息ID
     *
     * @param key redis的消息延时的key
     * @return 通知ID
     * @author zoe zheng
     * @date 2020/5/26 7:18 下午
     */
    Long getNotificationIdFromRedis(String key);

    /**
     * 查找用户ID
     *
     * @param uuids 消息触达用户uuid
     * @return 消息触达用户ID
     * @author zoe zheng
     * @date 2020/5/27 10:54 上午
     */
    List<Long> getUserId(List<String> uuids);

    /**
     * 获取空间所有用户
     *
     * @param spaceId 空间ID
     * @return 空间用户ID
     * @author zoe zheng
     * @date 2020/5/27 10:58 上午
     */
    List<Long> getSpaceAllUserId(String spaceId);

    /**
     * 获取空间管理员
     *
     * @param spaceId 空间ID
     * @return 空间管理员用户ID
     * @author zoe zheng
     * @date 2020/5/27 11:00 上午
     */
    List<Long> getSpaceAdminUserId(String spaceId);

    /**
     * 获取memberIds和spaceID对应的userId
     *
     * @param memberIds 成员ID
     * @param spaceId 空间id
     * @return memberId对应的用户ID
     * @author zoe zheng
     * @date 2020/5/27 11:02 上午
     */
    List<Long> getMemberUserId(List<Long> memberIds, String spaceId);

    /**
     * 获取成员呢称
     *
     * @param memberId 成员ID
     * @return 成员呢称
     * @author zoe zheng
     * @date 2020/5/28 4:02 下午
     */
    String getMemberName(Long memberId);

    /**
     * 统一消息处理的json
     *
     * @param object
     * @return
     * @author zoe zheng
     * @date 2020/6/17 2:07 下午
     */
    JSONObject getJsonObject(Object object);

    /**
     * 构造返回的extras的数据
     *
     * @param extras notifyBody中的extras数据
     * @param members 成员信息map
     * @return JSONObject
     * @author zoe zheng
     * @date 2020/6/17 2:52 下午
     */
    JSONObject formatExtra(JSONObject extras, Map<Long, PlayerBaseVo> members);

    /**
     * 获取关键字的信息
     *
     * @param dtos 通知数据
     * @return
     * @author zoe zheng
     * @date 2020/6/17 7:07 下午
     */
    NotificationRenderMap getRenderList(List<NotificationModelDto> dtos);

    /**
     * 获取memberIds对应的userId去除被删除的成员
     *
     * @param memberIds 成员ID
     * @return memberId对应的用户ID
     * @author zoe zheng
     * @date 2020/6/18 9:00 下午
     */
    List<Long> getMemberUserIdExcludeDeleted(List<Long> memberIds);

    /**
     * 获取空间主管理员
     *
     * @param spaceId 空间ID
     * @return
     * @author zoe zheng
     * @date 2020/6/22 4:25 下午
     */
    Long getSpaceSuperAdmin(String spaceId);

    /**
     * 根据模版ID获取触达用户标识
     *
     * @param templateId 模版ID
     * @return toUserTag
     * @author zoe zheng
     * @date 2020/7/9 11:12 上午
     */
    NotificationToTag getToUserTagByTemplateId(NotificationTemplateId templateId);

    /**
     * 获取节点的parentID
     *
     * @param nodeId
     * @return parentID
     * @author zoe zheng
     * @date 2020/7/14 3:10 下午
     */
    String getNodeParentId(String nodeId);

    /**
     * 根据memberIDs或者userIds获取需要的用户信息
     *
     * @param memberIds 成员ID
     * @param userIds 用户ID
     * @return
     * @author zoe zheng
     * @date 2020/10/13 11:44 上午
     */
    Map<Long, PlayerBaseVo> getPlayerBaseInfo(List<Long> memberIds, List<Long> userIds);

    /**
     * 获取第三方用户的userId
     *
     * @param platformType 第三方平台
     * @return List<Long>
     * @author zoe zheng
     * @date 2021/11/1 12:00
     */
    List<Long> getSocialUserIds(SocialPlatformType platformType);

    /**
     * 检查通知频率限制
     * @param userId 用户ID
     * @param template 模版
     * @param 随机字符串
     * @return 是否限制
     * @author zoe zheng
     * @date 2022/2/23 19:24
     */
    Boolean frequencyLimited(Long userId, NotificationTemplate template, String nonce);

    /**
     * 标记已经发送过的次数 人/每天
     * @param userId 用户ID
     * @param template 模版
     * @param nonce 随机字符串
     * @author zoe zheng
     * @date 2022/2/23 19:29
     */
    void addUserNotifyFrequency(Long userId, NotificationTemplate template, String nonce);

    /**
     * 构建第三方通知上下文
     *
     * @param spaceId 空间ID，第三方能发消息一定是绑定了空间站
     * @return SocialNotifyContext
     * @author zoe zheng
     * @date 2022/3/18 11:08
     */
    SocialNotifyContext buildSocialNotifyContext(String spaceId);

    /**
     * 获取应用入口地址
     * @param platform 平台
     * @param appType 应用类型
     * @param bindInfo 绑定信息
     * @return app入口页地址
     * @author zoe zheng
     * @date 2022/3/18 11:17
     */
    String getSocialAppEntryUrl(TenantBindDTO bindInfo, SocialPlatformType platform, SocialAppType appType);
}
