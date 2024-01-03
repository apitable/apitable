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

package com.apitable.organization.mapper;

import com.apitable.organization.dto.MemberBaseInfoDTO;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.dto.MemberTeamInfoDTO;
import com.apitable.organization.dto.MemberUserDTO;
import com.apitable.organization.dto.SearchMemberDTO;
import com.apitable.organization.dto.SpaceMemberDTO;
import com.apitable.organization.dto.TenantMemberDto;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.vo.MemberInfoVo;
import com.apitable.organization.vo.SearchMemberVo;
import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.player.dto.PlayerBaseDTO;
import com.apitable.shared.util.ibatis.ExpandBaseMapper;
import com.apitable.space.vo.MainAdminInfoVo;
import com.apitable.workspace.dto.MemberInfoDTO;
import com.apitable.workspace.vo.FieldRoleMemberVo;
import com.apitable.workspace.vo.NodeRoleMemberVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * member mapper.
 * </p>
 */
public interface MemberMapper extends ExpandBaseMapper<MemberEntity> {

    /**
     * get inactive member by email
     * updated：Find the inactive record id and space id with NULL mobile phone number and user id by email.
     *
     * @param email email
     * @return inactive member
     */
    List<MemberDTO> selectInactiveMemberByEmail(@Param("email") String email);

    /**
     * get inactive member by mobile
     * updated: it has not been used.
     *
     * @param mobile phone number
     * @return inactive member
     */
    List<MemberDTO> selectInactiveMemberByMobile(@Param("mobile") String mobile);

    /**
     * query row amount by space and email.
     *
     * @param spaceId space id
     * @param email   email
     * @return total amount
     */
    Integer selectCountBySpaceIdAndEmail(@Param("spaceId") String spaceId,
                                         @Param("email") String email);

    /**
     * fuzzy query member by keyword.
     *
     * <p>
     * only query non-wecom isv members, or the members had modify name in wecom isv space.
     * </p>
     *
     * @param spaceId    space id
     * @param memberName member name
     * @return members
     */
    List<SearchMemberDTO> selectByName(@Param("spaceId") String spaceId,
                                       @Param("memberName") String memberName);

    /**
     * search member by open id.
     *
     * <p>
     * only search the member which never modify name in wecom isv
     * </p>
     *
     * @param spaceId space id
     * @param openIds the third platform user's open id
     * @return members
     */
    List<SearchMemberDTO> selectByNameAndOpenIds(@Param("spaceId") String spaceId,
                                                 @Param("openIds") List<String> openIds);

    /**
     * fuzzy search member id by member name.
     *
     * <p>
     * only query non-wecom isv members, or the members had modify name in wecom isv space.
     * </p>
     *
     * @param spaceId  space id
     * @param likeName keyword
     * @return member id
     */
    List<Long> selectMemberIdsLikeName(@Param("spaceId") String spaceId,
                                       @Param("likeName") String likeName);

    /**
     * fuzzy search member by open id.
     *
     * <p>
     * only search the member which never modify name in wecom isv
     * </p>
     *
     * @param spaceId space id
     * @param openIds the third platform user's open id
     * @return member id
     */
    List<Long> selectMemberIdsLikeNameByOpenIds(@Param("spaceId") String spaceId,
                                                @Param("openIds") List<String> openIds);

    /**
     * batch query member ids by member names.
     *
     * @param spaceId     space id
     * @param memberNames member names
     * @return ID set
     */
    List<Long> selectIdBySpaceIdAndNames(@Param("spaceId") String spaceId,
                                         @Param("list") List<String> memberNames);

    /**
     * query the user ids in the team.
     *
     * @param teamId teamId
     * @return result
     */
    List<Long> selectUserIdByTeamId(@Param("teamId") Long teamId);

    /**
     * query member detail info.
     *
     * @param memberId member id
     * @return MemberInfoVo
     */
    MemberInfoVo selectInfoById(@Param("memberId") Long memberId);

    /**
     * query all members under the root team
     * TODO: 2022/4/1 invalid sql, the sql index is not used.
     *
     * @param spaceId space id
     * @return MemberInfoVo
     */
    List<MemberInfoVo> selectMembersByRootTeamId(@Param("spaceId") String spaceId);

    /**
     * query the team's members.
     *
     * @param teamIds teamIds
     * @return MemberInfoVo
     */
    List<MemberInfoVo> selectMembersByTeamId(@Param("teamIds") List<Long> teamIds);

    /**
     * get member name id even if he was deleted.
     *
     * @param id member id
     * @return member name
     */
    String selectMemberNameById(@Param("id") Long id);

    /**
     * query the user's member id in the space.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return member id
     */
    Long selectIdByUserIdAndSpaceId(@Param("userId") Long userId,
                                    @Param("spaceId") String spaceId);

    /**
     * query member name by user id and space id.
     *
     * @param spaceId space id
     * @param userId  user id
     * @return member name
     */
    String selectMemberNameByUserIdAndSpaceId(@Param("userId") Long userId,
                                              @Param("spaceId") String spaceId);

    /**
     * query by user id and space id.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return MemberEntity
     */
    MemberEntity selectByUserIdAndSpaceId(@Param("userId") Long userId,
                                          @Param("spaceId") String spaceId);

    /**
     * query the user's member id in the space, even if member is deleted.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return member id
     */
    Long selectMemberIdByUserIdAndSpaceIdIncludeDeleted(@Param("userId") Long userId,
                                                        @Param("spaceId") String spaceId);

    /**
     * query by user id and space id, include deleted member.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return MemberEntity
     */
    MemberEntity selectByUserIdAndSpaceIdIncludeDeleted(@Param("userId") Long userId,
                                                        @Param("spaceId") String spaceId);

    /**
     * get member brief info even if he was deleted.
     * （Avoid losing access to founder information that is no longer in space）
     *
     * @param memberId member id
     * @return member brief info
     */
    MemberDTO selectDtoByMemberId(@Param("memberId") Long memberId);

    /**
     * get member brief info without is_deleted value.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return complete basic information（contain avatar）
     */
    MemberDTO selectMemberDtoByUserIdAndSpaceId(@Param("userId") Long userId,
                                                @Param("spaceId") String spaceId);

    /**
     * update member's name.
     *
     * @param userId user id
     * @param name   member name
     * @return affected row
     */
    int updateMemberNameByUserId(@Param("userId") Long userId, @Param("name") String name);

    /**
     * modify member's 'SocialNameModified'.
     *
     * @param userId user id
     * @return affected row
     */
    int updateSocialNameModifiedByUserId(@Param("userId") Long userId);

    /**
     * update the user's phone in all spaces.
     *
     * @param userId user id
     * @param mobile phone number
     * @return affected row
     */
    int updateMobileByUserId(@Param("userId") Long userId, @Param("mobile") String mobile);

    /**
     * clear user's phone in all space.
     *
     * @param userId user id
     * @return affected row
     */
    int resetMobileByUserId(@Param("userId") Long userId);

    /**
     * update user's email in all space.
     *
     * @param userId user id
     * @param email  email
     * @return affected row
     */
    int updateEmailByUserId(@Param("userId") Long userId, @Param("email") String email);

    /**
     * clear user's email in all space.
     *
     * @param userId user id
     * @return affected row
     */
    int resetEmailByUserId(@Param("userId") Long userId);

    /**
     * update user' space inactive statues.
     *
     * @param userId user id
     * @return affected row
     */
    int updateInactiveStatusByUserId(@Param("userId") Long userId);

    /**
     * the space is changed to active.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return affected row
     */
    int updateActiveStatusByUserIdAndSpaceId(@Param("userId") Long userId,
                                             @Param("spaceId") String spaceId);

    /**
     * get the user's active space.
     *
     * @param userId user id
     * @return space id
     */
    String selectActiveSpaceByUserId(@Param("userId") Long userId);

    /**
     * Query member information.
     *
     * @param memberIds memberIds
     * @return MemberInfoDTO List
     * @author Chambers
     */
    List<MemberInfoDTO> selectMemberInfoDTOByIds(@Param("memberIds") Collection<Long> memberIds);

    /**
     * query member info by email.
     *
     * @param spaceId space id
     * @param email   email
     * @return MemberEntity
     */
    MemberEntity selectBySpaceIdAndEmail(@Param("spaceId") String spaceId,
                                         @Param("email") String email);

    /**
     * select by space id and email list with ignore deleted.
     *
     * @param spaceId space id
     * @param emails  email
     * @return entity
     */
    List<MemberEntity> selectBySpaceIdAndEmailsIgnoreDeleted(@Param("spaceId") String spaceId,
                                                             @Param("emails") List<String> emails);

    /**
     * get the space's main admin's info.
     *
     * @param spaceId space id
     * @return member info
     */
    MemberEntity selectAdminBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get space's main admins.
     * This method is used to fix the BUG of setting the admin.
     * Normally, there is only one main admin.
     *
     * @param spaceId space id
     * @return member info
     */
    List<MemberEntity> selectAdminListBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get one of the user's inactive spaces by the user id.
     *
     * @param userId user id
     * @return space id
     */
    String getFirstSpaceIdByUserId(@Param("userId") Long userId);

    /**
     * query user ids by space ids.
     *
     * @param spaceIds space ids
     * @return user ids
     */
    List<Long> selectUserIdBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * delete space's all member and flag space.（Dedicated to deleting space）
     *
     * @param spaceIds     space id
     * @param filterUserId user who filter（not a must）
     * @return affected row
     */
    int delBySpaceIds(@Param("spaceIds") List<String> spaceIds,
                      @Param("filterUserId") Long filterUserId);

    /**
     * recover space's pre deleted.
     *
     * @param spaceId space id
     * @return affected row
     */
    int cancelPreDelBySpaceId(@Param("spaceId") String spaceId);

    /**
     * The account is logically deleted during the cooling-off period. set status = 2 and set is_deleted = 1
     *
     * @param memberIds member id
     * @return affected row
     */
    int preDelByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * Allow account cancellation during cooling-off period.
     *
     * @param userId user id
     * @return affected row
     */
    int cancelPreDelByUserId(@Param("userId") Long userId);

    /**
     * activate the import members.
     *
     * @param userId user id
     * @param mobile phone number
     * @return affected row
     */
    int updateUserIdByMobile(@Param("userId") Long userId, @Param("mobile") String mobile);

    /**
     * query user id by member id.
     *
     * @param memberId member id
     * @return user id
     */
    Long selectUserIdByMemberId(@Param("memberId") Long memberId);

    /**
     * query user id by open id.
     *
     * @param openId open id
     * @return user id
     */
    Long selectUserIdByOpenId(@Param("spaceId") String spaceId, @Param("openId") String openId);

    /**
     * get user id by member id.
     *
     * @param memberIds member id
     * @return user ids
     */
    List<Long> selectUserIdsByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * query member by space id and member id.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @return total amount
     */
    MemberEntity selectMemberIdAndSpaceId(@Param("spaceId") String spaceId,
                                          @Param("memberId") Long memberId);

    /**
     * fuzzy search member by space id, keyword and filter members.
     *
     * <p>
     * only query non-wecom isv members, or the members had modify name in wecom isv space.
     * </p>
     *
     * @param spaceId space id
     * @param keyword keyword
     * @param filter  whether to filter unadded members
     * @return SearchMemberVo set
     */
    List<SearchMemberVo> selectLikeMemberName(@Param("spaceId") String spaceId,
                                              @Param("keyword") String keyword,
                                              @Param("filter") Boolean filter);

    /**
     * searach member by open id.
     *
     * <p>
     * only search the member which never modify name in wecom isv
     * </p>
     *
     * @param spaceId space id
     * @param openIds the third platform user's open id
     * @param filter  whether to filter unadded members
     * @return SearchMemberVo set
     */
    List<SearchMemberVo> selectLikeMemberNameByOpenIds(@Param("spaceId") String spaceId,
                                                       @Param("openIds") List<String> openIds,
                                                       @Param("filter") Boolean filter);

    /**
     * get main admin's member info.
     *
     * @param spaceId space id
     * @return vo
     */
    MainAdminInfoVo selectAdminInfoBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get member's unit info.
     *
     * @param memberId member id
     * @return UnitMemberVo set
     */
    UnitMemberVo selectUnitMemberByMemberId(@Param("memberId") Long memberId);

    /**
     * batch members' unit info.
     *
     * @param memberIds member id
     * @return UnitMemberVo set
     */
    List<UnitMemberVo> selectUnitMemberByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * query space's all user id.
     *
     * @param spaceId space id
     * @return userIds
     */
    List<Long> selectUserIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get the space's all member ids.
     *
     * @param spaceId space id
     * @return member ids
     */
    List<Long> selectMemberIdsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get the space's users who bind third party.
     *
     * @param spaceId space id
     * @return MemberEntity List
     */
    List<MemberEntity> selectBindSocialListBySpaceIdWithOffset(@Param("spaceId") String spaceId,
                                                               @Param("offset") long offset,
                                                               @Param("limit") int limit);

    /**
     * get the member's space id.
     *
     * @param memberId member id
     * @return space id
     */
    String selectSpaceIdByMemberId(@Param("memberId") Long memberId);

    /**
     * Query space ids.
     *
     * @param memberIds member table ids
     * @return space id list
     * @author Chambers
     */
    List<String> selectSpaceIdByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * query admin's user id by space id.
     *
     * @param spaceId space id
     * @return user ids
     */
    List<Long> selectAdminUserIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query all active member email in the space.
     *
     * @param spaceId space id
     * @return emails
     */
    List<String> selectActiveEmailBySpaceId(@Param("spaceId") String spaceId);

    /**
     * query member's email by member id.
     *
     * @param memberIds member ids
     * @return emails
     */
    List<String> selectEmailByBatchMemberId(@Param("memberIds") List<Long> memberIds);

    /**
     * query member's email by member id.
     *
     * @param emails  email
     * @param spaceId space id
     * @return member id
     */
    List<String> selectEmailBySpaceIdAndEmails(@Param("spaceId") String spaceId,
                                               @Param("emails") List<String> emails);

    /**
     * query user id by member id.
     *
     * @param spaceId space id
     * @param ids     member id set
     * @return userId
     */
    List<Long> selectUserIdBySpaceIdAndIds(@Param("spaceId") String spaceId,
                                           @Param("ids") List<Long> ids);

    /**
     * count the total by member ids.
     *
     * @param ids member id set
     * @return the row amount
     */
    Integer selectCountByMemberIds(@Param("ids") List<Long> ids);

    /**
     * query member info by member id and whether it is deleted.
     *
     * @param memberIds member ids
     * @return PlayerBaseDto list
     */
    List<PlayerBaseDTO> selectMemberInfoByMemberIdsIncludeDelete(
        @Param("memberIds") List<Long> memberIds);

    /**
     * Batch querying the records of the last members added to a user
     * !!!this query does not query the is deleted field.
     *
     * @param spaceId space id
     * @param userIds user ids
     * @return dto
     */
    List<MemberDTO> selectDtoBySpaceIdAndUserIds(@Param("spaceId") String spaceId,
                                                 @Param("userIds") List<Long> userIds);

    /**
     * !!! even if member is deleted.
     *
     * @param memberIds member id
     * @return MemberEntities
     */
    List<MemberEntity> selectByMemberIdsIgnoreDelete(
        @Param("memberIds") Collection<Long> memberIds);

    /**
     * deleting members in batches（delete logically）.
     *
     * @param memberIds member id
     * @return affected row
     */
    int deleteBatchByIds(@Param("memberIds") List<Long> memberIds);

    /**
     * Full property modification in order to restore the logical deletion state.
     *
     * @param entity member
     * @return affected row
     */
    int restoreMember(@Param("entity") MemberEntity entity);

    /**
     * query the members' NodeRole.
     *
     * @param memberIds member id
     * @return NodeRoleMemberVo
     */
    List<NodeRoleMemberVo> selectNodeRoleMemberByIds(
        @Param("memberIds") Collection<Long> memberIds);

    /**
     * Query Incomplete Member View.
     *
     * @param page    page param
     * @param spaceId space id
     * @return NodeRoleMemberVo page info
     * @author Chambers
     */
    IPage<NodeRoleMemberVo> selectIncompleteMemberVo(Page<NodeRoleMemberVo> page,
                                                     @Param("spaceId") String spaceId);

    /**
     * query the members' FieldRole.
     *
     * @param memberIds member id
     * @return FieldRoleMemberVo list
     */
    List<FieldRoleMemberVo> selectFieldRoleMemberByIds(
        @Param("memberIds") Collection<Long> memberIds);

    /**
     * get the space's user ids who bind third party.
     *
     * @param spaceIds space id
     * @return user ids
     */
    List<String> selectOpenIdBySpaceId(@Param("spaceIds") List<String> spaceIds);

    /**
     * query open id by member id.
     *
     * @param memberId member id
     * @return the third platform user's open id
     */
    String selectOpenIdByMemberId(@Param("memberId") Long memberId);

    /**
     * query open id list by member id list.
     *
     * @param memberIds member id list
     * @return the third platform user's open ids
     */
    List<String> selectOpenIdByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * query member id by open id.
     *
     * @param spaceId space id
     * @param openId  the third platform user's open id
     * @return member id
     */
    Long selectMemberIdBySpaceIdAndOpenId(@Param("spaceId") String spaceId,
                                          @Param("openId") String openId);

    /**
     * !!! even if the member is deleted logically.
     *
     * @param spaceId space id
     * @param openId  the third platform user's open id
     * @return member id
     */
    Long selectIdByOpenIdIgnoreDelete(@Param("spaceId") String spaceId,
                                      @Param("openId") String openId);

    /**
     * !!! even if the member is deleted logically.
     *
     * @param memberId member id
     * @return MemberEntity
     */
    MemberEntity selectByIdIgnoreDelete(@Param("memberId") Long memberId);

    /**
     * query open id by id.
     *
     * @param memberId member id
     * @return OPEN_ID
     */
    String selectOpenIdById(@Param("memberId") Long memberId);

    /**
     * query baseInfoDTO by id.
     *
     * @param memberIds member id
     * @return MemberBaseInfoDTO List
     */
    List<MemberBaseInfoDTO> selectBaseInfoDTOByIds(@Param("memberIds") Collection<Long> memberIds);

    /**
     * query by space id.
     *
     * @param spaceId       space id
     * @param ignoreDeleted whether to ignore logical deletion
     * @return MemberEntity List
     */
    List<MemberEntity> selectBySpaceId(@Param("spaceId") String spaceId,
                                       @Param("ignoreDeleted") boolean ignoreDeleted);

    /**
     * query space id and open id.
     *
     * @param spaceId space id
     * @param openId  the third platform user's open id
     * @return member info
     */
    MemberEntity selectBySpaceIdAndOpenId(@Param("spaceId") String spaceId,
                                          @Param("openId") String openId);

    /**
     * query by space id and open id list.
     *
     * @param spaceId space id
     * @param openIds the third platform user's open ids
     * @return member infos
     */
    List<MemberEntity> selectBySpaceIdAndOpenIds(@Param("spaceId") String spaceId,
                                                 @Param("openIds") List<String> openIds);

    /**
     * query member info by space id and member ids.
     *
     * @param userIds user id
     * @param spaceId space id
     * @return MemberEntity
     */
    List<MemberEntity> selectByUserIdsAndSpaceId(@Param("userIds") List<Long> userIds,
                                                 @Param("spaceId") String spaceId);

    /**
     * query the number of space members.
     *
     * @param spaceId space id
     * @return total amount
     */
    Long selectCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query the number of active members of the space.
     *
     * @param spaceId space id
     * @return total amount
     */
    Long selectActiveMemberCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get spaces' member info.
     *
     * @param spaceId space id
     * @return TenantMemberDto List
     */
    List<TenantMemberDto> selectMemberOpenIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * update member.
     *
     * @param entity member
     * @return affected row
     */
    int updateMemberById(@Param("entity") MemberEntity entity);

    /**
     * query random members exclude specified member.
     *
     * @param spaceId  space id
     * @param memberId filter member id
     * @return memberId
     */
    Long selectRandomMemberExclude(@Param("spaceId") String spaceId,
                                   @Param("memberId") Long memberId);

    /**
     * query user's all spaces info.
     *
     * @param userId user id
     * @return member ids
     */
    List<MemberEntity> selectByUserId(@Param("userId") Long userId);

    /**
     * query user's space id ignore deleted.
     *
     * @param userId user id
     * @return list of space id
     */
    List<String> selectSpaceIdByUserIdIgnoreDeleted(@Param("userId") Long userId);

    /**
     * query by space id list.
     *
     * @param spaceIds space id
     * @return space's members' info
     */
    List<SpaceMemberDTO> selectMembersBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * clean up the members by user id.
     *
     * @param userId user id
     * @return affected row
     */
    int clearMemberInfoByUserId(@Param("userId") Long userId);

    /**
     * clear open id.
     *
     * @param id member id
     * @return affected row
     */
    int clearOpenIdById(@Param("id") Long id);

    /**
     * query open id list by user id list.
     *
     * @param userIds user id
     * @return openId
     */
    List<String> selectOpenIdByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * query member info by user id list.
     *
     * @param userIds user id
     * @return MemberEntity
     */
    List<MemberEntity> selectByUserIds(@Param("spaceId") String spaceId,
                                       @Param("userIds") List<Long> userIds);

    /**
     * collects statistics on the space owned by users.
     *
     * @param userId user id
     * @return total amount
     */
    Integer selectCountByUserId(@Param("userId") Long userId);

    /**
     * get all of user's spaces which user modify his member's nickname.
     * Use to determine whether the user is a new user and has not changed any nicknames
     *
     * @param userId user id
     * @return total amount
     */
    Integer selectNameModifiedCountByUserId(@Param("userId") Long userId);

    /**
     * batch update member's name, open id and is_deleted.
     *
     * @param updateEntities members
     * @return boolean
     */
    Integer batchUpdateNameAndIsDeletedByIds(
        @Param("updateEntities") List<MemberEntity> updateEntities);

    /**
     * batch update is deleted and user id fields to default values.
     *
     * @param ids member table primary key
     * @return Integer
     */
    Integer updateIsDeletedAndUserIdToDefaultByIds(@Param("ids") List<Long> ids);

    /**
     * query team id list of member.
     *
     * @param memberId member id
     * @return team ids
     */
    List<Long> selectTeamIdsByMemberId(@Param("memberId") Long memberId);

    /**
     * query id by space id and email keyword.
     *
     * @param keyword email keyword
     * @param spaceId space id
     * @return ids
     */
    List<Long> selectIdsBySpaceIdAndEmailKeyword(@Param("spaceId") String spaceId,
                                                 @Param("keyword") String keyword);

    /**
     * batch query team's id by member's id.
     *
     * @param memberIds member id
     * @return member'id and member's teamId
     */
    List<MemberTeamInfoDTO> selectTeamIdsByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * query member info.
     *
     * @param memberIds member id list
     * @return MemberUserDTO
     */
    List<MemberUserDTO> selectMemberNameAndUserIdAndIsActiveByIds(
        @Param("memberIds") List<Long> memberIds);

    /**
     * query member info by user id list.
     *
     * @param userIds user id
     * @param spaceId space id
     * @return list of MemberUserDTO
     */
    List<MemberUserDTO> selectMemberNameByUserIdsAndSpaceIds(@Param("spaceId") String spaceId,
                                                             @Param("userIds") List<Long> userIds);

    /**
     * query user space ids.
     *
     * @param userId  user id
     * @param isAdmin is admin
     * @return list of space id
     */
    List<String> selectSpaceIdsByUserIdAndIsAdmin(@Param("userId") Long userId,
                                                  @Param("isAdmin") boolean isAdmin);
}
