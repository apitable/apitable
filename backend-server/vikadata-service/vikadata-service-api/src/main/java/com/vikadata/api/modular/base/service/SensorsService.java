package com.vikadata.api.modular.base.service;

import java.util.Map;

import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;

/**
 * <p>
 * 神策分析服务
 * </p>
 *
 * @author Chambers
 * @date 2020/4/8
 */
public interface SensorsService {

    /**
     * 记录事件
     *
     * @param userId     用户 ID
     * @param type       事件类型
     * @param scene      场景
     * @param originInfo 来源信息
     * @author Chambers
     * @date 2020/4/8
     */
    void track(Long userId, TrackEventType type, String scene, ClientOriginInfo originInfo);

    /**
     * 记录事件
     *
     * @param userId 用户 ID
     * @param eventType  事件类型
     * @param properties 事件的属性
     * @author zoe
     * @date 2020/4/8
     */
    void eventTrack(Long userId, TrackEventType eventType, Map<String, Object> properties, ClientOriginInfo originInfo);
}
