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

package com.apitable.interfaces.social.facade;

import com.apitable.interfaces.social.event.SocialEvent;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.interfaces.social.model.SocialUserBind;
import com.apitable.space.enums.SpaceUpdateOperate;
import java.util.List;
import java.util.Map;

/**
 * social service facade interface.
 */
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

    void checkWhetherSpaceCanChangeMainAdmin(String spaceId, Long opMemberId, Long acceptMemberId,
                                             List<SpaceUpdateOperate> spaceUpdateOperates);

    void deleteUser(Long userId);

    String getSuiteKeyByDingtalkSuiteId(String suiteId);

    List<String> fuzzySearchIfSatisfyCondition(String spaceId, String word);

    <T extends SocialEvent> void eventCall(T event);
}
