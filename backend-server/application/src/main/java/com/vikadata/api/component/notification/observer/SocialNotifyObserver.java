package com.vikadata.api.component.notification.observer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;

import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IUnitService;

public abstract class SocialNotifyObserver<M, T> extends AbstractNotifyObserver<M, T> {

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IUnitService iUnitService;

    @Override
    public List<String> toUser(NotificationCreateRo ro) {
        String fromOpenId = "";
        if (StrUtil.isNotBlank(ro.getFromUserId())) {
            fromOpenId =
                    CollUtil.getFirst(iMemberService.getOpenIdByUserIds(Collections.singletonList(Long.valueOf(ro.getFromUserId()))));
        }
        if (CollUtil.isNotEmpty(ro.getToUserId())) {
            String finalFromOpenId = fromOpenId;
            return iMemberService.getOpenIdByUserIds(ro.getToUserId().stream().filter(i -> ObjectUtil.notEqual(i,
                    finalFromOpenId)).map(Long::parseLong).collect(Collectors.toList()));
        }
        if (CollUtil.isNotEmpty(ro.getToMemberId())) {
            String finalFromOpenId1 = fromOpenId;
            return iMemberService.getOpenIdByIds(ro.getToMemberId().stream().filter(i -> ObjectUtil.notEqual(i,
                    finalFromOpenId1)).map(Long::parseLong).collect(Collectors.toList()));
        }
        if (CollUtil.isNotEmpty(ro.getToUnitId())) {
            String finalFromOpenId2 = fromOpenId;
            List<Long> memberIds =
                    iUnitService.getMembersIdByUnitIds(ro.getToUnitId().stream().map(Long::parseLong).collect(Collectors.toList()));
            return iMemberService.getOpenIdByIds(memberIds).stream().filter(i -> ObjectUtil.notEqual(i,
                    finalFromOpenId2)).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
