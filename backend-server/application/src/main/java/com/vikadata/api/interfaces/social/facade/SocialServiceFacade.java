package com.vikadata.api.interfaces.social.facade;

import java.util.List;
import java.util.Map;

import com.vikadata.api.interfaces.social.event.SocialEvent;
import com.vikadata.api.interfaces.social.model.SocialConnectInfo;
import com.vikadata.api.interfaces.social.model.SocialUserBind;
import com.vikadata.api.space.model.SpaceUpdateOperate;

public interface SocialServiceFacade {

    void createSocialUser(SocialUserBind socialUser);

    Long getUserIdByUnionId(String unionId);

    String getSpaceIdByDomainName(String domainName);

    String getDomainNameBySpaceId(String spaceId, boolean appendHttpsPrefix);

    Map<String, String> getDomainNameMap(List<String> spaceIds);

    void removeDomainBySpaceIds(List<String> spaceIds);

    SocialConnectInfo getConnectInfo(String spaceId);

    boolean checkSocialBind(String spaceId);

    void checkCanOperateSpaceUpdate(String spaceId, SpaceUpdateOperate spaceUpdateOperate);

    void checkWhetherSpaceCanChangeMainAdmin(String spaceId, Long opMemberId, Long acceptMemberId, List<SpaceUpdateOperate> spaceUpdateOperates);

    void deleteUser(Long userId);

    void deleteByUnionId(List<String> unionIds);

    String getSuiteKeyByDingtalkSuiteId(String suiteId);

    List<String> fuzzySearchIfSatisfyCondition(String spaceId, String word);

    <T extends SocialEvent> void eventCall(T event);
}
