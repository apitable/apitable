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

package com.apitable.organization.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.dto.TenantMemberDto;
import com.apitable.organization.dto.UploadDataDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.ro.TeamAddMemberRo;
import com.apitable.organization.ro.UpdateMemberOpRo;
import com.apitable.organization.ro.UpdateMemberRo;
import com.apitable.organization.vo.MemberBriefInfoVo;
import com.apitable.organization.vo.MemberInfoVo;
import com.apitable.organization.vo.UploadParseResultVO;

import org.springframework.web.multipart.MultipartFile;

public interface IMemberService extends IService<MemberEntity> {

    /**
     * get member name by id
     * @param memberId member id
     * @return member name
     */
    String getMemberNameById(Long memberId);

    /**
     * get member id
     *
     * @param userId user id
     * @param spaceId space id
     * @return MemberId
     */
    Long getMemberIdByUserIdAndSpaceId(Long userId, String spaceId);

    /**
     * getuser info
     *
     * @param userId user id
     * @param spaceId space id
     * @return MemberId
     */
    MemberEntity getByUserIdAndSpaceId(Long userId, String spaceId);

    /**
     * getuser info
     *
     * @param userIds user id
     * @param spaceId space id
     * @return MemberId
     */
    List<MemberEntity> getByUserIdsAndSpaceId(List<Long> userIds, String spaceId);

    /**
     * check whether user exists space
     *
     * @param userId user id
     * @param spaceId space id
     */
    void checkUserIfInSpace(Long userId, String spaceId);

    /**
     * set the main admin
     *
     * @param memberId  member id
     */
    void setMemberMainAdmin(Long memberId);

    /**
     * cancel the main admin
     *
     * @param memberId  member id
     */
    void cancelMemberMainAdmin(Long memberId);

    /**
     * get member's space id
     *
     * @param memberId  member id
     * @return space id
     */
    String getSpaceIdByMemberId(Long memberId);

    /**
     * get member's unit id
     *
     * @param memberId  member id
     * @return Unit id List
     */
    List<Long> getUnitsByMember(Long memberId);

    /**
     * get the space's users who binds third party
     *
     * @param spaceId space id
     * @return MemberEntity List
     */
    List<MemberEntity> getSocialMemberBySpaceId(String spaceId, long offset, int limit);

    /**
     * get space's member id
     *
     * @param spaceId space id
     * @return  member id
     */
    List<Long> getMemberIdsBySpaceId(String spaceId);

    /**
     * get space's member id
     *
     * @param spaceId space id
     * @param ignoreDeleted whether is deleted
     * @return MemberEntity List
     */
    List<MemberEntity> getMembersBySpaceId(String spaceId, boolean ignoreDeleted);

    /**
     * get member id
     *
     * @param spaceId space id
     * @param openId the third-party platform user's open id
     * @return  member id
     */
    Long getMemberIdBySpaceIdAndOpenId(String spaceId, String openId);

    /**
     * get space's member's info by open id
     *
     * @param spaceId space id
     * @param openId the third-party platform user's open id
     * @return MemberEntity
     */
    MemberEntity getBySpaceIdAndOpenId(String spaceId, String openId);

    /**
     * get space's members' info by open id
     *
     * @param spaceId space id
     * @param openIds the third-party platform user's open id
     * @return MemberEntity
     */
    List<MemberEntity> getBySpaceIdAndOpenIds(String spaceId, List<String> openIds);

    /**
     * get whether email exist the space.
     *
     * @param spaceId space id
     * @param email email
     * @return MemberEntity
     */
    MemberEntity getBySpaceIdAndEmail(String spaceId, String email);

    /**
     * get by space id and email list with ignore email
     * @param spaceId space id
     * @param emails email list
     * @return entity
     */
    List<MemberEntity> getBySpaceIdAndEmailsIgnoreDeleted(String spaceId, List<String> emails);

    /**
     * get space's main admin
     *
     * @param spaceId space id
     * @return user info
     */
    MemberEntity getAdminBySpaceId(String spaceId);

    /**
     * get space's main admins.
     * This method is used to fix the BUG of setting the admin. Normally, there is only one main admin.
     *
     * @param spaceId space id
     * @return user info
     */
    List<MemberEntity> getAdminListBySpaceId(String spaceId);

    /**
     * get member's OPEN_ID
     *
     * @param memberId  member id
     * @return openId
     */
    String getOpenIdByMemberId(Long memberId);

    /**
     * get member id even if he was deleted.
     *
     * @param spaceId space id
     * @param openId the third-party platform user's open id
     * @return  member id
     */
    Long getMemberIdByOpenIdIgnoreDelete(String spaceId, String openId);

    /**
     * !!! query member, even if he was deleted !!!
     *
     * @param memberId  member id
     * @return MemberEntity
     */
    MemberEntity getByIdIgnoreDelete(Long memberId);

    /**
     * get user's all spaces' member info
     *
     * @param userId user id
     * @return MemberEntity List
     */
    List<MemberEntity> getByUserId(Long userId);

    /**
     * get all user's spaces' id.
     *
     * @param userId user id
     * @return space id
     */
    List<String> getSpaceIdByUserId(Long userId);

    /**
     * get all id of user's spaces which user never modify his member's nickname. 
     *
     * @param userId user id
     * @return space ids
     */
    List<String> getSpaceIdWithoutNameModifiedByUserId(Long userId);

    /**
     * get inactive member by email
     *
     * @param email email
     * @return MemberDto List
     */
    List<MemberDTO> getInactiveMemberByEmails(String email);

    /**
     * update the user's member name in all spaces
     *
     * @param userId user id
     * @param memberName member name
     */
    void updateMemberNameByUserId(Long userId, String memberName);

    /**
     * update the user's phone in all spaces
     *
     * @param userId user id
     * @param mobile phone number
     */
    void updateMobileByUserId(Long userId, String mobile);

    /**
     * reset user's phone in all space.
     *
     * @param userId user id
     */
    void resetMobileByUserId(Long userId);

    /**
     * update user's email in all space.
     *
     * @param userId user id
     * @param email email
     */
    void updateEmailByUserId(Long userId, String email);

    /**
     * reset user's email in all space.
     *
     * @param userId user id
     */
    void resetEmailByUserId(Long userId);

    /**
     * get member brief info
     *
     * @param memberIds member ids
     * @return MemberBriefInfo
     */
    List<MemberBriefInfoVo> getMemberBriefInfo(List<Long> memberIds);

    /**
     * create members in batches.
     * the primary key ID for each member must be specified
     * the root department has been bound
     *
     * @param spaceId space id
     * @param entities members
     */
    void batchCreate(String spaceId, List<MemberEntity> entities);

    /**
     * recovery member
     *
     * @param member member info
     */
    void restoreMember(MemberEntity member);

    /**
     *
     * @param inviteUserId invite user id
     * @param spaceId space id
     * @param emails email list
     * @return invite member id list
     */
    List<Long> emailInvitation(Long inviteUserId, String spaceId, List<String> emails);

    /**
     * send invite email to email
     *
     * @param spaceId space id
     * @param fromMemberId the member who invite user
     * @param email email
     */
    void sendInviteEmail(String lang, String spaceId, Long fromMemberId, String email);

    /**
     * send an invitation space notification email
     *
     * @param spaceId space id
     * @param fromMemberId the member who invite user
     * @param email email
     */
    void sendUserInvitationNotifyEmail(String lang, String spaceId, Long fromMemberId, String email);

    /**
     * send user invitation email
     *
     * @param spaceId space id
     * @param inviter inviter is member id
     * @param inviteUrl invite link
     * @param emailAddress to email address
     */
    void sendUserInvitationEmail(String lang, String spaceId, Long inviter, String inviteUrl, String emailAddress);

    /**
     * the team's member
     *
     * @param spaceId space id
     * @param data member info
     */
    void addTeamMember(String spaceId, TeamAddMemberRo data);

    /**
     * update user info
     *
     * @param memberId  member id
     * @param opRo member info
     */
    void updateMember(Long memberId, UpdateMemberOpRo opRo);

    /**
     * update user info
     *
     * @param data member info
     */
    void updateMember(UpdateMemberRo data);

    /**
     * batch update member departments
     *
     * @param spaceId space id
     * @param memberIds  member ids
     * @param teamIds team ids
     */
    void updateMemberByTeamId(String spaceId, List<Long> memberIds, List<Long> teamIds);

    /**
     * department deletes members in batches
     *
     * @param spaceId space id
     * @param memberIds  member ids
     * @param teamId team id
     */
    void batchDeleteMemberFromTeam(String spaceId, List<Long> memberIds, Long teamId);

    /**
     * logic delete by member id
     *
     * @param memberIds  member ids
     */
    void removeByMemberIds(List<Long> memberIds);

    /**
     * delete all members of the space.
     *
     * @param spaceId space id
     */
    void removeAllMembersBySpaceId(String spaceId);

    /**
     * delete members completely from the space
     *
     * @param spaceId space id
     * @param memberIds  member ids
     * @param mailNotify whether to send email notification
     */
    void batchDeleteMemberFromSpace(String spaceId, List<Long> memberIds, boolean mailNotify);

    /**
     * the space is changed to active
     *
     * @param spaceId space id
     * @param userId user id
     */
    void updateActiveStatus(String spaceId, Long userId);

    /**
     * Space deletes members except the main admin（reserving department association）
     *
     * @param spaceId space id
     * @param userId mian admin's user id
     */
    void preDelBySpaceId(String spaceId, Long userId);

    /**
     * processing parse files
     *
     * @param spaceId space id
     * @param multipartFile file to parse
     * @return UploadParseResultVo
     */
    UploadParseResultVO parseExcelFile(String spaceId, MultipartFile multipartFile);

    /**
     * save uploaded data
     *
     * @param spaceId space id
     * @param uploadData uploadData
     * @param inviteEmails inviteEmails, callback
     * @param notifyEmails notifyEmails，callback
     * @param teamCreatable whether a department can be created
     * @return modified num
     */
    Long saveUploadData(String spaceId, UploadDataDTO uploadData, List<String> inviteEmails, List<String> notifyEmails, boolean teamCreatable);

    /**
     * send invite notification
     *
     * @param fromUserId Inviter
     * @param invitedMemberIds invited users
     * @param spaceId space
     * @param isToFromUser whether to send to the inviter
     */
    void sendInviteNotification(Long fromUserId, List<Long> invitedMemberIds, String spaceId, Boolean isToFromUser);

    /**
     * create member
     *
     * @param userId user id
     * @param spaceId space id
     * @param teamId team id（not a must）
     * @return Member Id
     */
    Long createMember(Long userId, String spaceId, Long teamId);

    /**
     * batch update members, even if his was deleted logically.
     *
     * @param entities members
     */
    void updatePartPropertyBatchByMemberId(String spaceId, List<MemberEntity> entities);

    /**
     * get space's members
     *
     * @param spaceId space id
     * @return Member List
     */
    List<TenantMemberDto> getMemberOpenIdListBySpaceId(String spaceId);

    /**
     * get a random member
     *
     * @param spaceId space id
     * @param excludeMemberId exclude member id
     * @return  member id
     */
    Long getRandomMemberId(String spaceId, Long excludeMemberId);

    /**
     * get space's member amount.
     *
     * @param spaceId space id
     * @return member amount
     */
    int getTotalMemberCountBySpaceId(String spaceId);

    /**
     * get space's total actived member amount.
     *
     * @param spaceId space id
     * @return member amount
     */
    int getTotalActiveMemberCountBySpaceId(String spaceId);

    /**
     * pre delete user info.
     * logic to delete.
     * Account logout can be cancelled during the cooling-off period.
     *
     * @param memberIds  member ids
     */
    void preDelByMemberIds(List<Long> memberIds);

    /**
     * cancel user info's deleted
     *
     * @param userId user id
     */
    void cancelPreDelByUserId(Long userId);

    /**
     * clear open id
     *
     * @param memberId  member id
     */
    void clearOpenIdById(Long memberId);

    /**
     * get open ids by user ids
     *
     * @param userIds userId
     * @return openId
     */
    List<String> getOpenIdByUserIds(List<Long> userIds);

    /**
     * get openId by member ids
     *
     * @param memberIds  member ids
     * @return openId
     */
    List<String> getOpenIdByIds(List<Long> memberIds);

    /**
     * get member name by space id and user id.
     *
     * @param spaceId space id
     * @param userId user id
     * @return member name
     */
    String getMemberNameByUserIdAndSpaceId(Long userId, String spaceId);

    /**
     * get inactive space by mobile
     *
     * @param mobile phone number
     * @return MemberDto List
     */
    List<MemberDTO> getInactiveMemberDtoByMobile(String mobile);

    /**
     * get inactive space by email
     *
     * @param email email
     * @return MemberDto List
     */
    List<MemberDTO> getInactiveMemberDtoByEmail(String email);

    /**
     * get the user's space's amount
     *
     * @param userId user id
     * @return the user's space's amount
     */
    int getSpaceCountByUserId(Long userId);

    /**
     * Check whether the user has already changed the nickname in one of the spaces
     *
     * @param userId user id
     * @return true | false
     */
    boolean checkUserHasModifyNameInSpace(Long userId);

    /**
     * batch update member name, open id and delete field.
     *
     * @param updateEntities members' update data
     */
    void batchUpdateNameAndOpenIdAndIsDeletedByIds(List<MemberEntity> updateEntities);

    /**
     * batch reset isDeleted and userId
     *
     * @param ids primary key of members
     */
    void batchResetIsDeletedAndUserIdByIds(List<Long> ids);

    /**
     * restores a member from space
     *
     * @param spaceId space id
     * @param memberIds  member id
     */
    void batchRecoveryMemberFromSpace(String spaceId, List<Long> memberIds);

    /**
     * handle memberInfo's team path name
     *
     * @param memberInfoVo member info view
     */
    void handleMemberTeamInfo(MemberInfoVo memberInfoVo);

    /**
     * active space if user has be invited to another space
     *
     * @param userId user id
     * @param memberIds member id list
     */
    void activeIfExistInvitationSpace(Long userId, List<Long> memberIds);
}
