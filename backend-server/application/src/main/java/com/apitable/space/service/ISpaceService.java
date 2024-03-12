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

package com.apitable.space.service;

import com.apitable.interfaces.ai.model.ChartTimeDimension;
import com.apitable.interfaces.ai.model.CreditInfo;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.internal.vo.InternalSpaceCapacityVo;
import com.apitable.internal.vo.InternalSpaceUsageVo;
import com.apitable.space.dto.GetSpaceListFilterCondition;
import com.apitable.space.dto.SpaceCapacityUsedInfo;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.model.CreditUsages;
import com.apitable.space.model.Space;
import com.apitable.space.ro.SpaceUpdateOpRo;
import com.apitable.space.vo.SeatUsage;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.space.vo.SpaceInfoVO;
import com.apitable.space.vo.SpaceSubscribeVo;
import com.apitable.space.vo.SpaceVO;
import com.apitable.space.vo.UserSpaceVo;
import com.apitable.user.entity.UserEntity;
import com.apitable.workspace.enums.NodeType;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Predicate;

/**
 * space service interface.
 */
public interface ISpaceService extends IService<SpaceEntity> {

    /**
     * get space entity by space id.
     *
     * @param spaceId space id
     * @return SpaceEntity
     */
    SpaceEntity getEntityBySpaceId(String spaceId);

    /**
     * get by space id.
     *
     * @param spaceId space id
     * @return SpaceEntity
     */
    SpaceEntity getBySpaceId(String spaceId);

    /**
     * check whether the space exists.
     *
     * @param spaceId space id
     */
    void checkExist(String spaceId);

    /**
     * get space by id with ignore whether deleted.
     *
     * @param spaceId space id
     * @return SpaceEntity
     */
    SpaceEntity getBySpaceIdIgnoreDeleted(String spaceId);

    /**
     * batch get space list.
     *
     * @param spaceIds space ids
     * @return SpaceEntity List
     */
    List<SpaceEntity> getBySpaceIds(List<String> spaceIds);

    /**
     * create space by user.
     *
     * @param user      user
     * @param spaceName spaceName
     * @return space object
     */
    Space createSpace(UserEntity user, String spaceName);

    /**
     * update space information.
     *
     * @param userId    userId
     * @param spaceId   space id
     * @param spaceOpRo SpaceUpdateOpRo
     */
    void updateSpace(Long userId, String spaceId, SpaceUpdateOpRo spaceOpRo);

    /**
     * prepare delete space operation.
     *
     * @param userId  userId
     * @param spaceId space id
     */
    void preDeleteById(Long userId, String spaceId);

    /**
     * delete space list by id.
     *
     * @param spaceIds space ids
     */
    void deleteSpace(Long userId, List<String> spaceIds);

    /**
     * cancel the delete operation.
     *
     * @param userId  userId
     * @param spaceId space id
     */
    void cancelDelByIds(Long userId, String spaceId);

    /**
     * quit space.
     *
     * @param spaceId  space id
     * @param memberId memberId
     */
    void quit(String spaceId, Long memberId);

    /**
     * query the list of space owned by a user.
     *
     * @param userId    userId
     * @param condition query condition
     * @return SpaceVO List
     */
    List<SpaceVO> getSpaceListByUserId(Long userId, GetSpaceListFilterCondition condition);

    /**
     * get node count by space id and exclude node type.
     *
     * @param spaceId space id
     * @param exclude exclude node type
     * @return node count
     */
    long getNodeCountBySpaceId(String spaceId, Predicate<NodeType> exclude);

    /**
     * get space credit info.
     *
     * @param spaceId space id
     * @return CreditInfo
     */
    CreditInfo getCredit(String spaceId);

    /**
     * get credit usage chart data.
     *
     * @param spaceId            space id
     * @param chartTimeDimension time dimension
     * @return CreditUsages
     */
    CreditUsages getCreditUsagesChart(
        String spaceId, ChartTimeDimension chartTimeDimension);

    /**
     * query the seat usage of space.
     *
     * @param spaceId space id
     * @return SeatUsage
     */
    SeatUsage getSeatUsage(String spaceId);

    /**
     * check whether chatBot nums of the space is over limit.
     *
     * @param spaceId space id
     */
    void checkChatBotNumsOverLimit(String spaceId);

    /**
     * check whether chatBot nums of the space is over limit.
     *
     * @param spaceId   space id
     * @param addedNums added chatBot nums
     */
    void checkChatBotNumsOverLimit(String spaceId, int addedNums);

    /**
     * check whether seat nums of the space is over limit.
     *
     * @param spaceId space id
     */
    void checkSeatOverLimit(String spaceId);

    /**
     * check whether seat nums of the space is over limit.
     *
     * @param spaceId       space id
     * @param addedSeatNums added seat nums
     */
    void checkSeatOverLimit(String spaceId, long addedSeatNums);

    /**
     * check whether file nums of the space is over limit.
     *
     * @param spaceId space id
     */
    void checkFileNumOverLimit(String spaceId);

    /**
     * check whether file nums of the space is over limit.
     *
     * @param spaceId     space id
     * @param addFileNums added file nums
     */
    void checkFileNumOverLimit(String spaceId, long addFileNums);

    /**
     * check whether seat nums of the space is over limit.
     * If the limit is exceeded, a notification needs to be sent
     *
     * @param spaceId       space id
     * @param addedSeatNums added seat nums
     * @param sendNotify    whether send notify
     * @param isAllMember   whether all member
     */
    boolean checkSeatOverLimitAndSendNotify(List<Long> userIds, String spaceId, long addedSeatNums,
                                            boolean isAllMember, boolean sendNotify);

    /**
     * Get the seat usage status of third-party IM.
     *
     * @param spaceId space id
     * @return SeatUsage
     */
    SeatUsage getSeatUsageForIM(String spaceId);

    /**
     * get space info.
     *
     * @param spaceId space id
     * @return SpaceInfoVO
     */
    SpaceInfoVO getSpaceInfo(String spaceId);

    /**
     * get space capacity used sizes information.
     *
     * @param spaceId          space id
     * @param capacityUsedSize space capacity used sizes
     * @return SpaceCapacityUsedInfo space capacity used information
     */
    SpaceCapacityUsedInfo getSpaceCapacityUsedInfo(String spaceId, Long capacityUsedSize);

    /**
     * gets the amount of space used
     * the internal interface.
     *
     * @param spaceId space id
     * @return InternalSpaceUsageVo
     */
    InternalSpaceUsageVo getInternalSpaceUsageVo(String spaceId);

    /**
     * the internal interface.
     *
     * @param spaceId space id
     * @return InternalSpaceCapacityVo
     */
    InternalSpaceCapacityVo getSpaceCapacityVo(String spaceId);

    /**
     * change main administer of space.
     *
     * @param spaceId  space id
     * @param memberId memberId
     * @return new main admin user id
     */
    Long changeMainAdmin(String spaceId, Long memberId);

    /**
     * remove main admin.
     *
     * @param spaceId space id
     */
    void removeMainAdmin(String spaceId);

    /**
     * get main administer member id of space.
     *
     * @param spaceId space id
     * @return main admin member id
     */
    Long getSpaceMainAdminMemberId(String spaceId);

    /**
     * get main administer user id of space.
     *
     * @param spaceId space id
     * @return main admin user id
     */
    Long getSpaceMainAdminUserId(String spaceId);

    /**
     * Check that the member is not the master administrator of the space.
     *
     * @param spaceId  space id
     * @param memberId memberId
     * @param consumer consumer
     */
    void checkMemberIsMainAdmin(String spaceId, Long memberId, Consumer<Boolean> consumer);

    /**
     * throw exception if member is not admin in space.
     *
     * @param spaceId  space id
     * @param memberId member id
     */
    void checkMemberIsAdmin(String spaceId, Long memberId);

    /**
     * Check that the members is not the master administrator of the space
     * If yes, throwing exception.
     *
     * @param spaceId   space id
     * @param memberIds memberIds
     */
    void checkMembersIsMainAdmin(String spaceId, List<Long> memberIds);

    /**
     * get permission resource in space.
     *
     * @param userId  userId
     * @param spaceId space id
     * @return UserSpaceVo
     */
    UserSpaceVo getUserSpaceResource(Long userId, String spaceId);

    /**
     * get space features.
     *
     * @param spaceId space id
     * @return SpaceGlobalFeature
     */
    SpaceGlobalFeature getSpaceGlobalFeature(String spaceId);

    /**
     * change the space feature.
     *
     * @param userId  userId
     * @param spaceId space id
     * @param feature feature
     */
    void switchSpacePros(Long userId, String spaceId, SpaceGlobalFeature feature);

    /**
     * Check whether space resources are allowed to be manipulated.
     *
     * @param spaceId space id
     */
    void checkCanOperateSpaceUpdate(String spaceId);

    /**
     * get space id by relation id.
     *
     * @param linkId linkId（sharing id or template id）
     * @return spaceId
     */
    String getSpaceIdByLinkId(String linkId);

    /**
     * get space name.
     *
     * @param spaceId space id
     * @return space name
     */
    String getNameBySpaceId(String spaceId);

    /**
     * get owner user id of space.
     *
     * @param spaceId space id
     * @return main admin userId
     */
    Long getSpaceOwnerUserId(String spaceId);

    /**
     * verify whether the space has been authenticated.
     *
     * @param spaceId space id
     * @return boolean
     */
    boolean isCertified(String spaceId);

    /**
     * switch space.
     *
     * @param userId  userId
     * @param spaceId space id
     */
    void switchSpace(Long userId, String spaceId);

    /**
     * check space available.
     *
     * @param spaceId spaceId
     * @return SpaceEntity
     */
    SpaceEntity isSpaceAvailable(String spaceId);

    /**
     * Check whether the user is in space.
     *
     * @param userId   user id
     * @param spaceId  space id
     * @param consumer callback
     */
    void checkUserInSpace(Long userId, String spaceId, Consumer<Boolean> consumer);

    /**
     * get space subscription view.
     *
     * @param spaceId space id
     * @return SpaceSubscribeVo
     */
    SpaceSubscribeVo getSpaceSubscriptionInfo(String spaceId);

    /**
     * get space owner open id.
     *
     * @param spaceId space id
     * @return open id
     */
    String getSpaceOwnerOpenId(String spaceId);


    /**
     * Get space seat available status.
     *
     * @param spaceId space id
     * @return SeatAvailableStatus
     * @author Chambers
     */
    boolean getSpaceSeatAvailableStatus(String spaceId);

    /**
     * get space ids by created by.
     *
     * @param userId user id
     * @return space ids
     */
    List<String> getSpaceIdsByCreatedBy(Long userId);

    /**
     * check widget whether over limit.
     *
     * @param spaceId space id
     */
    void checkWidgetOverLimit(String spaceId);

    /**
     * get space subscription.
     *
     * @param spaceId space id
     * @return SubscriptionInfo
     */
    SubscriptionInfo getSpaceSubscription(String spaceId);

    /**
     * get social connection info.
     *
     * @param spaceId space id
     * @return SocialConnectInfo
     */
    SocialConnectInfo getSocialConnectInfo(String spaceId);

    /**
     * get social suite key.
     *
     * @param appId app id
     * @return social suite key
     */
    String getSocialSuiteKeyByAppId(String appId);

}
