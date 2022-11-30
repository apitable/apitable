package com.vikadata.api.interfaces.social.model;

import java.util.List;

import com.vikadata.api.space.enums.SpaceResourceGroupCode;

public interface SocialConnectInfo {

    String getSpaceId();

    Integer getPlatform();

    Integer getAppType();

    String getAppId();

    String getTenantId();

    Integer getAuthMode();

    boolean isEnabled();

    String getRemindObserver();

    List<SpaceResourceGroupCode> getDisableResourceGroupCodes();
}
