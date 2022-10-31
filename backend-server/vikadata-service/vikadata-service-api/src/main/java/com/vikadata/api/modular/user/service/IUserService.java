package com.vikadata.api.modular.user.service;


import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.config.security.Auth0UserProfile;
import com.vikadata.api.model.ro.user.DtBindOpRo;
import com.vikadata.api.model.ro.user.UserOpRo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.User;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.define.dtos.UserInPausedDto;
import com.vikadata.entity.UserEntity;

/**
 * <p>
 * User table service class
 * </p>
 */
public interface IUserService extends IService<UserEntity> {

    /**
     * Obtain user ID according to mobile number
     * 
     * @param mobile cell-phone number
     * @return User ID
     */
    Long getUserIdByMobile(String mobile);

    /**
     * Obtain user ID according to email address
     * 
     * @param email email
     * @return User ID
     */
    Long getUserIdByEmail(String email);

    /**
     * Determine whether the mobile phone number has been registered
     *
     * @param code   Area code
     * @param mobile Phone number
     * @return true/false
     */
    boolean checkByCodeAndMobile(String code, String mobile);

    /**
     * Determine whether the email has been bound
     *
     * @param email email
     * @return true/false
     */
    boolean checkByEmail(String email);

    /**
     * Get Users
     *
     * @param code          Area code
     * @param mobilePhone   Phone number
     * @return UserEntity
     */
    UserEntity getByCodeAndMobilePhone(String code, String mobilePhone);

    /**
     * Get Users
     *
     * @param code          Area code
     * @param mobilePhones  Mobile number list
     * @return UserEntity
     */
    List<UserEntity> getByCodeAndMobilePhones(String code, Collection<String> mobilePhones);

    /**
     * Get Users
     *
     * @param email email
     * @return UserEntity
     */
    UserEntity getByEmail(String email);

    /**
     * Get users in batch
     *
     * @param emails email list
     * @return UserEntity
     */
    List<UserEntity> getByEmails(Collection<String> emails);

    /**
     * External system connection creation user
     *
     * @param nickName Nickname
     * @param avatar Avatar
     * @param email email
     * @param externalId External System ID
     * @param remark Remarks
     * @return user id
     */
    Long createByExternalSystem(String externalId, String nickName, String avatar, String email, String remark);

    /**
     * Create User
     *
     * @param user User
     * @return user id
     */
    Long createSocialUser(User user);

    /**
     * Create Lark User
     *
     * @param user User
     * @return user id
     */
    Long createUser(SocialUser user);

    /**
     * create user
     *
     * @param user user entity
     * @return user id
     */
    boolean saveUser(UserEntity user);

    /**
     * create user by auth0 user profile
     *
     * @param userProfile auth0 user profile
     * @return user id
     */
    Long createUserByAuth0IfNotExist(Auth0UserProfile userProfile);

    /**
     * create user by auth0 user model
     *
     * @param user user info from auth0 model
     * @return user id
     */
    Long createUserByAuth0IfNotExist(com.auth0.json.mgmt.users.User user);

    /**
     * Create enterprise WeChat third-party associated users
     *
     * @param user User information
     * @return vika user ID
     */
    Long createWeComUser(SocialUser user);

    /**
     * Activate the specified space
     *
     * @param userId User ID
     * @param spaceId Space ID
     * @param openId Open Unique ID
     */
    void activeTenantSpace(Long userId, String spaceId, String openId);

    /**
     * Create Account
     *
     * @param areaCode  Area code
     * @param mobile Phone number
     * @param nickName   Third party user nickname
     * @param avatar Third party user avatar
     * @param email  email
     * @param spaceName Name of the new space
     * @return userId
     */
    Long create(String areaCode, String mobile, String nickName, String avatar, String email, String spaceName);

    /**
     * Create an account by phone number
     *
     * @param areaCode  Area code
     * @param mobile Phone number
     * @param nickName   Third party user nickname
     * @param avatar Third party user avatar
     * @return user
     */
    UserEntity createUserByMobilePhone(String areaCode, String mobile, String nickName, String avatar);

    /**
     * Create an account by email
     *
     * @param email email
     * @return UserEntity
     */
    UserEntity createUserByEmail(String email);

    /**
     * Batch create vest numbers
     */
    void createUsersByCli();

    /**
     * Create User
     * Create operation initiated by CLI tool to create user vest
     *
     * @param username User name (email)
     * @param password Password
     * @param phone Phone number
     * @return user entity
     */
    UserEntity createUserByCli(String username, String password, String phone);

    /**
     * initial new space for new user
     *
     * @param user user entity
     */
    void initialDefaultSpaceForUser(UserEntity user);

    /**
     * active space if user has be invited to another space
     *
     * @param userId user id
     * @param memberIds member id list
     */
    void activeInvitationSpace(Long userId, List<Long> memberIds);

    /**
     * Query whether users bind email
     *
     * @param userId User ID
     * @return Boolean
     */
    boolean checkUserHasBindEmail(Long userId);

    /**
     * Bind associated member email
     *
     * @param userId  User ID
     * @param spaceId Space ID
     * @param email   email
     */
    void bindMemberByEmail(Long userId, String spaceId, String email);

    /**
     * User bind email
     *
     * @param userId User ID
     * @param email  email
     */
    void updateEmailByUserId(Long userId, String email);

    /**
     * User Unbind Email
     *
     * @param userId User ID
     */
    void unbindEmailByUserId(Long userId);

    /**
     * User modifies mobile number
     *
     * @param userId User ID
     * @param code   Area code
     * @param mobile Phone number
     */
    void updateMobileByUserId(Long userId, String code, String mobile);

    /**
     * User unbind mobile number
     *
     * @param userId    User Id
     */
    void unbindMobileByUserId(Long userId);

    /**
     * Update user logon time
     *
     * @param userId User ID
     */
    void updateLoginTime(Long userId);

    /**
     * Edit user information
     *
     * @param userId User ID
     * @param param  Operate parameters
     */
    void edit(Long userId, UserOpRo param);

    /**
     * Change Password
     *
     * @param userId   User ID
     * @param password New password set
     */
    void updatePwd(Long userId, String password);

    /**
     * Get current user information and space content
     *
     * @param userId  User ID
     * @param spaceId Space ID
     * @param filter  Whether to filter space related information
     * @return UserInfoVo
     */
    UserInfoVo getCurrentUserInfo(Long userId, String spaceId, Boolean filter);

    /**
     * Associated DingTalk
     *
     * @param opRo Request parameters
     */
    void bindDingTalk(DtBindOpRo opRo);

    /**
     * Close the user's multi ended session
     *
     * @param userId   User ID
     * @param isRetain Whether to keep the current session
     */
    void closeMultiSession(Long userId, boolean isRetain);

    /**
     * Unbind Third Party
     *
     * @param userId    User ID
     * @param type      Third party type
     */
    void unbind(Long userId, Integer type);

    /**
     * Get UUID
     *
     * @param userId    User ID
     * @return uuid
     */
    String getUuidByUserId(Long userId);

    /**
     * Log off the user account and enter the calm period.
     * The account cancellation in the calm period is exactly the same as the account cancellation from the user's perspective, and the sharing link, invitation link, personal invitation code, etc. are unavailable
     *
     * @param user User
     * */
    void applyForClosingAccount(UserEntity user);

    /**
     * Cancellation of account cancellation is only applicable to cancellation of account in calm period
     *
     * @param user UserEntity
     */
    void cancelClosingAccount(UserEntity user);

    /**
     * Official close of account
     *
     * @param user UserEntity
     */
    void closeAccount(UserEntity user);

    /**
     * Obtain the cooling off period account, excluding the cancelled account
     *
     * @param userIds User ID List
     * @return UserInPausedDto List
     */
    List<UserInPausedDto> getPausedUserDtos(List<Long> userIds);

    /**
     * <p>
     *     Obtain the mail user ID and the system language set by the user according to the mail list<br/>
     *     There is no record line corresponding to email in the database, and the modified email still exists in the result list, and the corresponding language is "browser language"<br/>
     *     It is better not to include non-existent emails
     * </p>
     * <br/>
     * <p>
     *     Note: Asynchronous method calls may be abnormal
     * </p>
     *
     * @param emails Email list
     * @return List with user id, system language and email
     */
    List<UserLangDTO> getLangByEmails(List<String> emails);

    /**
     * <p>
     *     Obtain the mail user ID and the system language set by the user according to the mail list<br/>
     *     There is no record line corresponding to the email in the database, but the modified email still exists in the result list, and the corresponding language is expected Lang.<br/>
     *     It is better not to include non-existent emails
     * </p>
     *
     * @param expectedLang The user did not set the system language. The expected email sending language
     * @param emails Email list
     * @return List with user id, system language and email
     */
    List<UserLangDTO> getLangByEmails(String expectedLang, List<String> emails);

    /**
     * <p>
     *     Get the system language according to the mail<br/>
     *     There is no record line corresponding to email in the database, and the corresponding language is expected Lang<br/>
     * </p>
     *
     * @param expectedLang The user did not set the system language. The expected email sending language
     * @param email Email
     * @return System language
     */
    String getLangByEmail(String expectedLang, String email);

    /**
     * Get the user language according to the user ID
     *
     * @param userIds User ID
     * @param defaultLocale Default Language
     * @return List<UserLangDTO>
     */
    List<UserLangDTO> getLangAndEmailByIds(List<Long> userIds, String defaultLocale);

    void useInviteCodeReward(Long userId, String inviteCode);

    /**
     * Obtain user ID according to uuid
     *
     * @param uuid User uuid
     * @return User ID
     */
    Long getUserIdByUuid(String uuid);

    /**
     * Query users by user's name
     *
     * @param areaCode  Area code（Not required, used when the user name is mobile number)
     * @param username  User's name (email or phone number)
     * @return UserEntity
     */
    UserEntity getByUsername(String areaCode, String username);
}
