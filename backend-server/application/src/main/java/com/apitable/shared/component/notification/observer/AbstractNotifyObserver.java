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

package com.apitable.shared.component.notification.observer;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.organization.service.IMemberService;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.shared.component.notification.NotificationHelper;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.apitable.space.service.ISpaceService;
import com.apitable.workspace.service.INodeService;

import javax.annotation.Resource;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static cn.hutool.core.date.DatePattern.NORM_DATETIME_MINUTE_PATTERN;
import static com.apitable.shared.constants.NotificationConstants.*;

/**
 * <p>
 * base notify observer
 * </p>
 * @author zoe zheng
 */
public abstract class AbstractNotifyObserver<M, T> implements NotifyObserver<M, T> {
    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IMemberService iMemberService;

    @Override
    public boolean isNotify(T context) {
        return true;
    }

    @Override
    public Map<String, Object> bindingMap(NotificationCreateRo ro) {
        Map<String, Object> bindingMap = new HashMap<>();
        bindingMap.put("createdAt",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_MINUTE_PATTERN)));
        if (StrUtil.isNotBlank(ro.getSpaceId())) {
            bindingMap.put("spaceName", iSpaceService.getNameBySpaceId(ro.getSpaceId()));
            bindingMap.put("spaceId", ro.getSpaceId());
        }
        if (StrUtil.isNotBlank(ro.getNodeId())) {
            bindingMap.put("nodeName", iNodeService.getNodeNameByNodeId(ro.getNodeId()));
            bindingMap.put("nodeId", ro.getNodeId());
        }
        if (StrUtil.isNotBlank(ro.getNotifyId())) {
            bindingMap.put("notifyId", ro.getNotifyId());
        }
        long fromUserId = Long.parseLong(ro.getFromUserId());
        if (fromUserId > 0) {
            String memberName = StrUtil.blankToDefault(iMemberService.getMemberNameByUserIdAndSpaceId(fromUserId,
                    ro.getSpaceId()), I18nStringsUtil.t("unnamed"));
            bindingMap.put(StrUtil.toCamelCase(EMAIL_MEMBER_NAME), memberName);
        }
        JSONObject extras = NotificationHelper.getExtrasFromNotifyBody(ro.getBody());
        if (extras != null) {
            extras.forEach((k, v) -> {
                if (StrUtil.endWith(k, "At")) {
                    LocalDateTime dateTime = DateUtil.toLocalDateTime(Instant.ofEpochMilli(Long.parseLong(v.toString())));
                    bindingMap.put(k, DateUtil.format(dateTime, NORM_DATETIME_MINUTE_PATTERN));
                }
                else if (Objects.equals(k, INVOLVE_RECORD_IDS)) {
                    bindingMap.put(StrUtil.toCamelCase(EMAIL_RECORD_ID), JSONUtil.parseArray(v).get(0));
                }
                else {
                    bindingMap.put(k, v);
                }
            });
        }
        return bindingMap;
    }

    @Override
    public void notify(T context, List<NotificationCreateRo> roList) {
        roList.forEach(i -> notify(context, i));
    }
}
