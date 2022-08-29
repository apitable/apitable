package com.vikadata.api.modular.social.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.mapper.SocialFeishuEventLogMapper;
import com.vikadata.api.modular.social.service.ISocialFeishuEventLogService;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SocialFeishuEventLogEntity;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

import org.springframework.stereotype.Service;

/**
 * 第三方平台集成-飞书事件日志 服务接口 实现
 *
 * @author Shawn Deng
 * @date 2020-12-14 19:49:54
 */
@Service
@Slf4j
public class SocialFeishuEventLogServiceImpl extends ServiceImpl<SocialFeishuEventLogMapper, SocialFeishuEventLogEntity> implements ISocialFeishuEventLogService {

    @Resource
    private SocialFeishuEventLogMapper socialFeishuEventLogMapper;

    @Override
    public void doneEvent(String uuid) {
        if (StrUtil.isBlank(uuid)) {
            return;
        }
        socialFeishuEventLogMapper.updateStatusTrueByUuid(uuid);
    }

    @Override
    public <T extends BaseEvent> boolean create(T event) {
        boolean duplicate = SqlTool.retCount(socialFeishuEventLogMapper.selectCountByUuid(event.getMeta().getUuid())) > 0;
        if (duplicate) {
            log.error("重复飞书事件通知,请检查是否已经处理完,租户[{}], 事件类型[{}], 事件标识[{}]", event.getTenantKey(), event.getType(), event.getMeta().getUuid());
            return false;
        }
        SocialFeishuEventLogEntity eventLog = new SocialFeishuEventLogEntity();
        eventLog.setTs(event.getMeta().getTs());
        eventLog.setUuid(event.getMeta().getUuid());
        eventLog.setType(event.getType());
        eventLog.setAppId(event.getAppId());
        eventLog.setTenantKey(event.getTenantKey());
        eventLog.setEventData(JSONUtil.toJsonStr(event));
        return save(eventLog);
    }

    @Override
    public <T extends BaseV3ContactEvent> boolean createV3ContactEventLog(T event) {
        SocialFeishuEventLogEntity logEntity = socialFeishuEventLogMapper.selectByUuid(event.getHeader().getEventId());
        if (logEntity != null) {
            log.error("重复飞书事件通知,请检查是否已经处理完,租户[{}],事件类型[{}],事件标识[{}]", event.getHeader().getTenantKey(), event.getHeader().getEventType(), event.getHeader().getEventId());
            return logEntity.getStatus();
        }
        SocialFeishuEventLogEntity eventLog = new SocialFeishuEventLogEntity();
        eventLog.setTs(event.getHeader().getCreateTime());
        eventLog.setUuid(event.getHeader().getEventId());
        eventLog.setType(event.getHeader().getEventType());
        eventLog.setAppId(event.getHeader().getAppId());
        eventLog.setTenantKey(event.getHeader().getTenantKey());
        eventLog.setEventData(JSONUtil.toJsonStr(event));
        return save(eventLog);
    }
}
