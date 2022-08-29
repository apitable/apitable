package com.vikadata.api.component.notification.observer;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.component.notification.NotificationHelper;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.VikaStrings;

import static cn.hutool.core.date.DatePattern.NORM_DATETIME_MINUTE_PATTERN;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_MEMBER_NAME;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_RECORD_ID;
import static com.vikadata.api.constants.NotificationConstants.INVOLVE_RECORD_IDS;

/**
 * <p>
 * 通知观察者--钉钉自建应用
 * </p>
 * @author zoe zheng
 * @date 2022/3/15 18:30
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
                    ro.getSpaceId()), VikaStrings.t("unnamed"));
            bindingMap.put(StrUtil.toCamelCase(EMAIL_MEMBER_NAME), memberName);
        }
        JSONObject extras = NotificationHelper.getExtrasFromNotifyBody(ro.getBody());
        if (extras != null) {
            extras.forEach((k, v) -> {
                // 处理时间戳
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
