package com.vikadata.api.space.service;

import java.util.List;
import java.util.function.Consumer;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.internal.vo.InternalSpaceCapacityVo;
import com.vikadata.api.internal.vo.InternalSpaceUsageVo;
import com.vikadata.api.space.dto.GetSpaceListFilterCondition;
import com.vikadata.api.space.dto.SpaceCapacityUsedInfo;
import com.vikadata.api.space.vo.SpaceGlobalFeature;
import com.vikadata.api.space.vo.SpaceSubscribeVo;
import com.vikadata.api.space.ro.SpaceUpdateOpRo;
import com.vikadata.api.space.vo.SpaceInfoVO;
import com.vikadata.api.space.vo.SpaceVO;
import com.vikadata.api.space.vo.UserSpaceVo;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.entity.SpaceEntity;

public interface ISpaceService extends IService<SpaceEntity> {

    /**
     * @param spaceId space id
     * @return SpaceEntity
     */
    SpaceEntity getBySpaceId(String spaceId);

    /**
     * check whether the space exists
     * @param spaceId space id
     */
    void checkExist(String spaceId);

    /**
     * @param spaceId space id
     * @return SpaceEntity
     */
    SpaceEntity getBySpaceIdIgnoreDeleted(String spaceId);

    /**
     * @param spaceIds space ids
     * @return SpaceEntity List
     */
    List<SpaceEntity> getBySpaceIds(List<String> spaceIds);

    /**
     * user creation space
     *
     * @param user    user
     * @param spaceName spaceName
     * @return space id
     */
    String createSpace(UserEntity user, String spaceName);

    /**
     * @param userId userId
     * @param spaceId space id
     * @param spaceOpRo SpaceUpdateOpRo
     */
    void updateSpace(Long userId, String spaceId, SpaceUpdateOpRo spaceOpRo);

    /**
     * @param userId userId
     * @param spaceId space id
     */
    void preDeleteById(Long userId, String spaceId);

    /**
     * @param spaceIds space ids
     */
    void deleteSpace(Long userId, List<String> spaceIds);

    /**
     * cancel the delete
     *
     * @param userId userId
     * @param spaceId space id
     */
    void cancelDelByIds(Long userId, String spaceId);

    /**
     * quit space
     *
     * @param spaceId space id
     * @param memberId memberId
     */
    void quit(String spaceId, Long memberId);

    /**
     * query the list of space owned by a user
     *
     * @param userId userId
     * @param condition query condition
     * @return SpaceVO List
     */
    List<SpaceVO> getSpaceListByUserId(Long userId, GetSpaceListFilterCondition condition);

    /**
     * @param spaceId space id
     * @return SpaceInfoVO
     */
    SpaceInfoVO getSpaceInfo(String spaceId);

    /**
     * get space capacity used sizes information
     *
     * @param spaceId space id
     * @param capacityUsedSize space capacity used sizes
     * @return SpaceCapacityUsedInfo space capacity used information
     */
    SpaceCapacityUsedInfo getSpaceCapacityUsedInfo(String spaceId, Long capacityUsedSize);

    /**
     * gets the amount of space used
     * the internal interface
     *
     * @param spaceId space id
     * @return InternalSpaceUsageVo
     */
    InternalSpaceUsageVo getInternalSpaceUsageVo(String spaceId);

    /**
     * the internal interface
     *
     * @param spaceId space id
     * @return InternalSpaceCapacityVo
     */
    InternalSpaceCapacityVo getSpaceCapacityVo(String spaceId);

    /**
     * @param spaceId space id
     * @param memberId memberId
     * @return new main admin user id
     */
    Long changeMainAdmin(String spaceId, Long memberId);

    /**
     * remove main admin
     *
     * @param spaceId space id
     */
    void removeMainAdmin(String spaceId);

    /**
     * @param spaceId space id
     * @return main admin member id
     */
    Long getSpaceMainAdminMemberId(String spaceId);

    /**
     * @param spaceId space id
     * @return main admin user id
     */
    Long getSpaceMainAdminUserId(String spaceId);

    /**
     * Check that the member is not the master administrator of the space
     * If yes, throwing a exception
     *
     * @param spaceId space id
     * @param memberId memberId
     */
    void checkMemberIsMainAdmin(String spaceId, Long memberId);

    /**
     * Check that the members is not the master administrator of the space
     * If yes, throwing a exception
     *
     * @param spaceId space id
     * @param memberIds memberIds
     */
    void checkMembersIsMainAdmin(String spaceId, List<Long> memberIds);

    /**
     * queries whether a member is in a space
     *
     * @param spaceId space id
     * @param memberId memberId
     */
    void checkMemberInSpace(String spaceId, Long memberId);

    /**
     * batch queries whether a member is in a space
     *
     * @param spaceId space id
     * @param memberIds memberIds
     */
    void checkMembersInSpace(String spaceId, List<Long> memberIds);

    /**
     * @param userId userId
     * @param spaceId space id
     * @return UserSpaceVo
     */
    UserSpaceVo getUserSpaceResource(Long userId, String spaceId);

    /**
     * @param spaceId space id
     * @return SpaceGlobalFeature
     */
    SpaceGlobalFeature getSpaceGlobalFeature(String spaceId);

    /**
     * change the space feature
     *
     * @param userId userId
     * @param spaceId space id
     * @param feature   feature
     */
    void switchSpacePros(Long userId, String spaceId, SpaceGlobalFeature feature);

    /**
     * Check whether space resources are allowed to be manipulated
     *
     * @param spaceId space id
     */
    void checkCanOperateSpaceUpdate(String spaceId);

    /**
     * @param linkId linkId（sharing id or template id）
     * @return spaceId
     */
    String getSpaceIdByLinkId(String linkId);

    /**
     * Check whether the contact is being synchronized
     * 
     * @param spaceId space id
     * @return Boolean
     */
    Boolean isContactSyncing(String spaceId);

    /**
     * the label space is synchronizing the contact
     *
     * @param spaceId space id
     */
    void setContactSyncing(String spaceId, String value);

    /**
     * the space synchronization contact is marked
     *
     * @param spaceId space id
     */
    void contactFinished(String spaceId);

    /**
     * @param spaceId space id
     * @return space name
     */
    String getNameBySpaceId(String spaceId);

    /**
     * @param spaceId space id
     * @return main admin's userId
     */
    Long getSpaceOwnerUserId(String spaceId);

    /**
     * verify whether the space has been authenticated
     *
     * @param spaceId space id
     * @return boolean
     */
    boolean isCertified(String spaceId);

    /**
     * switch space
     *
     * @param userId userId
     * @param spaceId space id
     */
    void switchSpace(Long userId, String spaceId);

    /**
     * check space available
     * @param spaceId spaceId
     */
    void isSpaceAvailable(String spaceId);

    /**
     *  Check whether the user is in space
     * @param userId    user id
     * @param spaceId space id
     * @param consumer  callback
     */
    void checkUserInSpace(Long userId, String spaceId, Consumer<Boolean> consumer);

    SpaceSubscribeVo getSpaceSubscriptionInfo(String spaceId);
}
