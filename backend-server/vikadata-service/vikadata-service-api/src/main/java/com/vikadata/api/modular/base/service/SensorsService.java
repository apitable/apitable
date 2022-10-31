package com.vikadata.api.modular.base.service;

import java.util.Map;

import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;

/**
 * Sensors Analysis Service
 */
public interface SensorsService {

    /**
     * record event
     *
     * @param userId     user id
     * @param type       event type
     * @param scene      scenes
     * @param originInfo source information
     */
    void track(Long userId, TrackEventType type, String scene, ClientOriginInfo originInfo);

    /**
     * record event
     *
     * @param userId user id
     * @param eventType  event type
     * @param properties properties of the event
     */
    void eventTrack(Long userId, TrackEventType eventType, Map<String, Object> properties, ClientOriginInfo originInfo);
}
