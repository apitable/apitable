/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.observer.remind;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.net.url.UrlPath;
import cn.hutool.core.net.url.UrlQuery;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.http.HtmlUtil;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.user.mapper.UserMapper;
import com.apitable.workspace.entity.NodeRelEntity;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.mapper.NodeRelMapper;
import com.apitable.workspace.observer.DatasheetRemindObserver;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * abstract remind class.
 */
@Slf4j
public abstract class AbstractRemind implements DatasheetRemindObserver {

    @Resource
    protected RedisTemplate<String, Object> redisTemplate;

    @Resource
    protected MemberMapper memberMapper;

    @Resource
    protected UserMapper userMapper;

    @Resource
    protected SpaceMapper spaceMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private NodeRelMapper nodeRelMapper;

    @Resource
    private ConstProperties constProperties;

    @Override
    public void sendNotify(NotifyDataSheetMeta meta) {
        if (meta.fromMemberId == null && meta.fromUserId == null) {
            log.info(
                "[remind notification]-meta:fromMemberId｜fromUserId is null, do not send messages.");
            return;
        }
        if (CollUtil.isEmpty(meta.toMemberIds)) {
            log.info("[remind notification]-meta:toMemberIds is null, do not send messages.");
            return;
        }
        // build parameters
        wrapperMeta(meta);
        // member
        if (meta.remindType == RemindType.MEMBER) {
            this.notifyMemberAction(meta);
        }
        // comment
        if (meta.remindType == RemindType.COMMENT) {
            this.notifyCommentAction(meta);
        }
    }

    /**
     * get send subscription type.
     */
    public abstract RemindChannel getRemindType();

    protected abstract void wrapperMeta(NotifyDataSheetMeta meta);

    /**
     * notify @member actions.
     */
    public abstract void notifyMemberAction(NotifyDataSheetMeta meta);

    /**
     * notify comments actions.
     */
    public abstract void notifyCommentAction(NotifyDataSheetMeta meta);

    /**
     * build notification url.
     * <p>
     * notification url build format.
     * </p>
     * {ServerDomain}/workbench/{mirrorId}/{nodeId}/{viewId}/{recordId}?comment=1&notifyId={notifyId}
     * </p>
     * Url parameters:
     * </p>
     * <br>
     * ServerDomain：current service domain name (optional) <br>
     * mirrorId：mirror node id (maybe empty)<br>
     * nodeId：datasheet id <br>
     * viewId：datasheet view id <br>
     * recordId：rowId <br>
     * notifyId：notifyId <br>
     */
    protected String buildNotifyUrl(NotifyDataSheetMeta meta, boolean falgServerDomain) {
        StringBuilder notifyUr = new StringBuilder();
        if (falgServerDomain) {
            notifyUr.append(constProperties.getServerDomain());
        }

        // path
        UrlPath notifyPath = UrlPath.of("workbench", CharsetUtil.CHARSET_UTF_8);
        notifyPath.add(meta.nodeId);
        // determine whether the node is a mirror
        if (meta.getNodeId().startsWith(IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum())) {
            // DataSheetId
            NodeRelEntity mainNode = nodeRelMapper.selectByRelNodeId(meta.getNodeId());
            ExceptionUtil.isNotNull(mainNode, PermissionException.NODE_NOT_EXIST);
            notifyPath.add(mainNode.getMainNodeId());
        }
        notifyPath.add(meta.viewId).add(meta.recordId);
        notifyUr.append(notifyPath.build(CharsetUtil.CHARSET_UTF_8));

        // query parameters
        UrlQuery notifyQuery = meta.remindType == RemindType.MEMBER ? new UrlQuery() :
            UrlQuery.of("comment=1", CharsetUtil.CHARSET_UTF_8);
        // notifyId need to mark the message as read
        notifyQuery.add("notifyId", meta.notifyId);
        notifyUr.append('?').append(notifyQuery.build(CharsetUtil.CHARSET_UTF_8));

        return notifyUr.toString();
    }

    protected String getNodeName(String nodeId) {
        return nodeMapper.selectNodeNameByNodeId(nodeId);
    }

    protected String getMemberName(Long memberId) {
        return memberMapper.selectMemberNameById(memberId);
    }

    /**
     * get member name. if memberId == null, query defaultUserId.
     */
    protected String getMemberName(Long memberId, Long defaultUserId) {
        if (null != memberId) {
            return getMemberName(memberId);
        }
        return getUserName(defaultUserId);
    }

    protected MemberEntity getMember(Long memberId) {
        return memberMapper.selectById(memberId);
    }

    protected String getUserName(Long userId) {
        return userMapper.selectNickNameById(userId);
    }

    protected String getSpaceName(String spaceId) {
        return spaceMapper.selectSpaceNameBySpaceId(spaceId);
    }

    protected String unescapeHtml(String contentHtml) {
        return HtmlUtil.unescape(HtmlUtil.filter(contentHtml));
    }

}
