package com.vikadata.api.interfaces.social.facade;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.vikadata.api.interfaces.social.event.SocialEvent;
import com.vikadata.api.interfaces.social.model.SocialConnectInfo;
import com.vikadata.api.interfaces.social.model.SocialUserBind;
import com.vikadata.api.space.enums.SpaceUpdateOperate;

public class DefaultSocialServiceFacade implements SocialServiceFacade {

    @Override
    public void createSocialUser(SocialUserBind socialUser) {

    }

    @Override
    public Long getUserIdByUnionId(String unionId) {
        return null;
    }

    @Override
    public String getSpaceIdByDomainName(String domainName) {
        return null;
    }

    @Override
    public String getDomainNameBySpaceId(String spaceId, boolean appendHttpsPrefix) {
        return null;
    }

    @Override
    public Map<String, String> getDomainNameMap(List<String> spaceIds) {
        return Collections.emptyMap();
    }

    @Override
    public void removeDomainBySpaceIds(List<String> spaceIds) {

    }

    @Override
    public SocialConnectInfo getConnectInfo(String spaceId) {
        return null;
    }

    @Override
    public boolean checkSocialBind(String spaceId) {
        return false;
    }

    @Override
    public void checkCanOperateSpaceUpdate(String spaceId, SpaceUpdateOperate spaceUpdateOperate) {

    }

    @Override
    public void checkWhetherSpaceCanChangeMainAdmin(String spaceId, Long opMemberId, Long acceptMemberId, List<SpaceUpdateOperate> spaceUpdateOperates) {

    }

    @Override
    public void deleteUser(Long userId) {

    }

    @Override
    public void deleteByUnionId(List<String> unionIds) {

    }

    @Override
    public String getSuiteKeyByDingtalkSuiteId(String suiteId) {
        return null;
    }

    @Override
    public List<String> fuzzySearchIfSatisfyCondition(String spaceId, String word) {
        return null;
    }

    @Override
    public <T extends SocialEvent> void eventCall(T event) {

    }
}
