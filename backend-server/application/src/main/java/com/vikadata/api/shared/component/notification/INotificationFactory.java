package com.vikadata.api.shared.component.notification;

import java.util.List;
import java.util.Map;

import cn.hutool.json.JSONObject;

import com.vikadata.api.player.dto.NotificationModelDTO;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.player.vo.NotificationDetailVo;
import com.vikadata.api.player.vo.PlayerBaseVo;
import com.vikadata.api.shared.sysconfig.notification.NotificationTemplate;
import com.vikadata.api.space.dto.BaseSpaceInfoDTO;
import com.vikadata.api.workspace.dto.NodeBaseInfoDTO;

/**
 * <p>
 * notification factory
 * </p>
 *
 * @author zoe zheng
 */
public interface INotificationFactory {

    /**
     * get by template id
     *
     * @param templateId template id
     * @return NotificationTemplate
     */
    NotificationTemplate getTemplateById(String templateId);

    /**
     * assemble sender
     *
     * @param fromUserId sender
     * @param spaceId space id
     * @param renderMap render map
     * @return PlayerBaseVo
     */
    PlayerBaseVo formatFromUser(Long fromUserId, String spaceId, NotificationRenderMap renderMap);

    /**
     * assemble node info
     *
     * @param node node DTO
     * @return node detail view
     */
    NotificationDetailVo.Node formatNode(NodeBaseInfoDTO node);

    /**
     * assemble space data
     *
     * @param space space info
     * @return space detail
     */
    NotificationDetailVo.Space formatSpace(BaseSpaceInfoDTO space);

    /**
     * whether the locks that need to be counted for message sending exist
     *
     * @param key redis key
     * @param notificationId notification id
     * @return true | false
     */
    boolean delayLock(String key, Long notificationId);

    /**
     * Get the key to count the number of times the message is sent
     *
     * @param toUserId recipient
     * @param ro message request
     * @return redis lock key
     */
    String getDelayLockKey(String toUserId, NotificationCreateRo ro);

    /**
     * get notification id from redis
     *
     * @param key cache key
     * @return notification id
     */
    Long getNotificationIdFromRedis(String key);

    /**
     * get all user id in space
     *
     * @param spaceId space id
     * @return space id
     */
    List<Long> getSpaceAllUserId(String spaceId);

    /**
     * get user id
     *
     * @param memberIds member id
     * @param spaceId space id
     * @return user id
     */
    List<Long> getMemberUserId(List<Long> memberIds, String spaceId);

    /**
     * parse object to json
     *
     * @param object object
     * @return JSON Object
     */
    JSONObject getJsonObject(Object object);

    /**
     * build extra
     *
     * @param extras extra json object
     * @param members member map
     * @return JSONObject
     */
    JSONObject formatExtra(JSONObject extras, Map<Long, PlayerBaseVo> members);

    /**
     * get render list
     *
     * @param dtos notification model
     * @return render map
     */
    NotificationRenderMap getRenderList(List<NotificationModelDTO> dtos);

    /**
     * Get the userId corresponding to member Ids to remove the deleted member
     *
     * @param memberIds member id list
     * @return user id
     */
    List<Long> getMemberUserIdExcludeDeleted(List<Long> memberIds);

    /**
     * get admin of space
     *
     * @param spaceId space id
     * @return member id
     */
    Long getSpaceSuperAdmin(String spaceId);

    /**
     * get notification target
     *
     * @param templateId template id
     * @return toUserTag
     */
    NotificationToTag getToUserTagByTemplateId(NotificationTemplateId templateId);

    /**
     * get parent node id
     *
     * @param nodeId node id
     * @return parent node id
     */
    String getNodeParentId(String nodeId);

    /**
     * get user payer map
     *
     * @param memberIds member id
     * @param userIds user id
     * @return user player map
     */
    Map<Long, PlayerBaseVo> getPlayerBaseInfo(List<Long> memberIds, List<Long> userIds);

    /**
     * check notification frequency
     * @param userId user id
     * @param template template
     * @param nonce random string
     * @return true | false
     */
    Boolean frequencyLimited(Long userId, NotificationTemplate template, String nonce);

    /**
     * Number of times the mark has been sent(users/every day)
     * @param userId user id
     * @param template template
     * @param nonce random string
     */
    void addUserNotifyFrequency(Long userId, NotificationTemplate template, String nonce);
}
