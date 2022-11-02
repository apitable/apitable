package com.vikadata.api.modular.social.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.vikadata.api.modular.social.model.OneAccessCopyInfoRo.MemberRo;


public interface IOneAccessService {

    /**
     * Get the authorized account space station ID
     * @param bimRemoteUser  Authentication and authorization account
     * @param bimRemotePwd   Authentication and authorization password
     * @return space id
     */
    String getSpaceIdByBimAccount(String bimRemoteUser, String bimRemotePwd);

    /**
     * create user
     * @param spaceId  space id
     * @param mobile   mobile number
     * @param nickName nickname
     * @param email    email
     * @param openOrgId external orgId
     * @param oneId     Oneaccess unit id
     * @return user id
     * @date 2021/11/24 13:50
     */
    Long createUser(String spaceId, String mobile, String loginName, String nickName, String email, String openOrgId,String oneId);

    /**
     * Update user information
     * @param spaceId  space id
     * @param mobile   mobile number
     * @param nickName nickname
     * @param email    email
     * @param openOrgId external orgId
     * @return is success
     * @date 2021/11/24 13:52
     */
    boolean updateUser(String spaceId, Long userId, String mobile, String loginName, String nickName, String email, String openOrgId);

    /**
     * delete user
     * @param spaceId space id
     * @param userId  userId
     * @date 2021/11/24 13:52
     */
    void deleteUser(String spaceId, Long userId);


    /**
     * Login with authorization code
     * @param code oauth2.0 authorization code
     * @return Whether the login is successful
     * @date 2021/11/24 18:52
     */
    Long getUserIdByCode(String code);


    /**
     * Get user ID by login name and external unitid
     * @param loginName loginName
     * @param uid       external unitid
     * @return Whether the login is successful
     * @date 2021/11/24 18:52
     */
    Long getUserIdByLoginNameAndUnionId(String loginName,String uid);

    /**
     * Convert the obtained encrypted data to the official OneAccess source data
     *
     */
    <T> T getRequestObject(HttpServletRequest request, Class<T> requestType);

    /**
     * Create a department
     * @param spaceId   Space id
     * @param orgName   Department name
     * @param openOrgId External Department ID
     * @param openParentOrgId External parent department ID
     * @return  internal social_dep_id
     */
    Long createOrg(String spaceId,String orgName,String openOrgId,String openParentOrgId);

    /**
     * Update a department
     * @param uid                internal social_dep_id
     * @param openOrgId          External department ID, unique value cannot be updated
     * @param orgName            Department name
     * @param openParentOrgId    External Department ID
     * @param enable             whether to disable
     */
    void updateOrg(String uid,String spaceId,String openOrgId,String orgName,String openParentOrgId,boolean enable);

    /**
     * Delete a department
     * @param uid  Department ID, unique value cannot be updated
     */
    void deleteOrg(String spaceId,String uid);

    /**
     * Copy departments and personnel to the designated space station
     * @param spaceId     Space Id
     * @param destSpaceId Target Space Id
     * @param teamIds     List of team ids
     * @param memberRoList list of member ids
     */
    void copyTeamAndMembers(String spaceId,String destSpaceId, List<String> teamIds,List<MemberRo> memberRoList);
}
