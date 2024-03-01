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

package com.apitable.user.service;

import com.apitable.user.dto.UserInPausedDto;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.dto.UserSensitiveDTO;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.ro.UserOpRo;
import com.apitable.user.vo.UserInfoVo;
import com.apitable.user.vo.UserSimpleVO;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * User table service class.
 */
public interface IUserService extends IService<UserEntity> {

    /**
     * Obtain user ID according to mobile number.
     *
     * @param mobile cell-phone number
     * @return User ID
     */
    Long getUserIdByMobile(String mobile);

    /**
     * Obtain user ID according to email address.
     *
     * @param email email
     * @return User ID
     */
    Long getUserIdByEmail(String email);

    /**
     * Determine whether the mobile phone number has been registered.
     *
     * @param code   Area code
     * @param mobile Phone number
     * @return true/false
     */
    boolean checkByCodeAndMobile(String code, String mobile);

    /**
     * Determine whether the email has been bound.
     *
     * @param email email
     * @return true/false
     */
    boolean checkByEmail(String email);

    /**
     * Get Users.
     *
     * @param code        Area code
     * @param mobilePhone Phone number
     * @return UserEntity
     */
    UserEntity getByCodeAndMobilePhone(String code, String mobilePhone);

    /**
     * Get Users.
     *
     * @param code         Area code
     * @param mobilePhones Mobile number list
     * @return UserEntity
     */
    List<UserEntity> getByCodeAndMobilePhones(String code,
                                              Collection<String> mobilePhones);

    /**
     * Get Users.
     *
     * @param email email
     * @return UserEntity
     */
    UserEntity getByEmail(String email);

    /**
     * Get users in batch.
     *
     * @param emails email list
     * @return UserEntity
     */
    List<UserEntity> getByEmails(Collection<String> emails);

    /**
     * External system connection creation user.
     *
     * @param nickName   Nickname
     * @param avatar     Avatar
     * @param email      email
     * @param externalId External System ID
     * @param remark     Remarks
     * @return user id
     */
    Long createByExternalSystem(String externalId, String nickName,
                                String avatar, String email, String remark);

    /**
     * create user.
     *
     * @param user user entity
     * @return user id
     */
    boolean saveUser(UserEntity user);

    /**
     * Create Account.
     *
     * @param areaCode  Area code
     * @param mobile    Phone number
     * @param nickName  Third party user nickname
     * @param avatar    Third party user avatar
     * @param email     email
     * @param spaceName Name of the new space
     * @return userId
     */
    Long create(String areaCode, String mobile, String nickName, String avatar,
                String email, String spaceName);

    /**
     * Create an account by phone number.
     *
     * @param areaCode Area code
     * @param mobile   Phone number
     * @param nickName Third party user nickname
     * @param avatar   Third party user avatar
     * @return user
     */
    UserEntity createUserByMobilePhone(String areaCode, String mobile,
                                       String nickName, String avatar);

    /**
     * Create an account by email.
     *
     * @param email email
     * @return UserEntity
     */
    UserEntity createUserByEmail(String email);

    /**
     * Create an account by email.
     *
     * @param email    email
     * @param password password
     * @return UserEntity
     */
    UserEntity createUserByEmail(String email, String password);

    /**
     * Create an account by email.
     *
     * @param email    email
     * @param password password
     * @param lang lang
     * @return UserEntity
     */
    UserEntity createUserByEmail(String email, String password, String lang);

    /**
     * initial new space for new user.
     *
     * @param user user entity
     */
    void initialDefaultSpaceForUser(UserEntity user);

    /**
     * Query whether users bind email.
     *
     * @param userId User ID
     * @return Boolean
     */
    boolean checkUserHasBindEmail(Long userId);

    /**
     * Bind associated member email.
     *
     * @param userId  User ID
     * @param spaceId Space ID
     * @param email   email
     */
    void bindMemberByEmail(Long userId, String spaceId, String email);

    /**
     * User bind email.
     *
     * @param userId User ID
     * @param email  email
     * @param oldEmail old email
     */
    void updateEmailByUserId(Long userId, String email, String oldEmail);

    /**
     * User Unbind Email.
     *
     * @param userId User ID
     */
    void unbindEmailByUserId(Long userId);

    /**
     * User modifies mobile number.
     *
     * @param userId User ID
     * @param code   Area code
     * @param mobile Phone number
     */
    void updateMobileByUserId(Long userId, String code, String mobile);

    /**
     * User unbind mobile number.
     *
     * @param userId User Id
     */
    void unbindMobileByUserId(Long userId);

    /**
     * Update user logon time.
     *
     * @param userId User ID
     */
    void updateLoginTime(Long userId);

    /**
     * Edit user information.
     *
     * @param userId User ID
     * @param param  Operate parameters
     */
    void edit(Long userId, UserOpRo param);

    /**
     * Change Password.
     *
     * @param userId   User ID
     * @param password New password set
     */
    void updatePwd(Long userId, String password);

    /**
     * Get current user information and space content.
     *
     * @param userId  User ID
     * @param spaceId Space ID
     * @param filter  Whether to filter space related information
     * @return UserInfoVo
     */
    UserInfoVo getCurrentUserInfo(Long userId, String spaceId, Boolean filter);

    /**
     * Close the user's multi ended session.
     *
     * @param userId   User ID
     * @param isRetain Whether to keep the current session
     */
    void closeMultiSession(Long userId, boolean isRetain);

    /**
     * Get UUID.
     *
     * @param userId User ID
     * @return uuid
     */
    String getUuidByUserId(Long userId);

    /**
     * get username by user id.
     *
     * @param userId user id
     * @return username
     */
    String getNicknameByUserId(Long userId);

    /**
     * Log off the user account and enter the calm period. The account
     * cancellation in the calm period is exactly the same as the account
     * cancellation from the user's perspective, and the sharing link,
     * invitation link, personal invitation code, etc. are unavailable.
     *
     * @param user User
     */
    void applyForClosingAccount(UserEntity user);

    /**
     * Cancellation of account cancellation is only applicable to cancellation
     * of account in calm period.
     *
     * @param user UserEntity
     */
    void cancelClosingAccount(UserEntity user);

    /**
     * Official close of account.
     *
     * @param user UserEntity
     */
    void closeAccount(UserEntity user);

    /**
     * Obtain the cooling off period account, excluding the cancelled account.
     *
     * @param userIds User ID List
     * @return UserInPausedDto List
     */
    List<UserInPausedDto> getPausedUserDtos(List<Long> userIds);

    /**
     * Obtain the mail user ID and the system language set by the user according
     * to the mail list<br/> There is no record line corresponding to the email
     * in the database, but the modified email still exists in the result list,
     * and the corresponding language is expected Lang.<br/> It is better not to
     * include non-existent emails.
     *
     * @param expectedLang The user did not set the system language. The
     *                     expected email sending language
     * @param emails       Email list
     * @return List with user id, system language and email
     */
    List<UserLangDTO> getLangByEmails(String expectedLang, List<String> emails);

    /**
     * Get the system language according to the mail<br/> There is no record
     * line corresponding to email in the database, and the corresponding
     * language is expected Lang.
     *
     * @param expectedLang The user did not set the system language. The
     *                     expected email sending language
     * @param email        Email
     * @return System language
     */
    String getLangByEmail(String expectedLang, String email);

    /**
     * Get the user language according to the user ID.
     *
     * @param userIds       User ID
     * @param defaultLocale Default Language
     * @return {@link UserLangDTO}
     */
    List<UserLangDTO> getLangAndEmailByIds(List<Long> userIds,
                                           String defaultLocale);

    /**
     * Obtain user ID according to uuid.
     *
     * @param uuid User uuid
     * @return User ID
     */
    Long getUserIdByUuidWithCheck(String uuid);

    /**
     * Query users by user's name.
     *
     * @param areaCode Area code（Not required, used when the user name is mobile
     *                 number)
     * @param username User's name (email or phone number)
     * @return UserEntity
     */
    UserEntity getByUsername(String areaCode, String username);

    /**
     * get user's email by user id.
     *
     * @param userId user id
     * @return user's email
     */
    String getEmailByUserId(Long userId);

    /**
     * Close Paused User.
     * Among them, the account has applied for cancellation for more than limit Days
     */
    void closePausedUser(int limitDays);

    /**
     * get user email and mobile phone.
     *
     * @param userIds user id list
     * @return UserSensitiveDTO
     */
    List<UserSensitiveDTO> getUserSensitiveInfoByIds(List<Long> userIds);

    /**
     * get user simple info.
     *
     * @param userIds user id list
     * @param spaceId user's space id
     * @return a map with userId as key
     */
    Map<Long, UserSimpleVO> getUserSimpleInfoMap(String spaceId, List<Long> userIds);

    /**
     * get user simple info.
     *
     * @param userIds user id list
     * @return list UserEntity
     */
    List<UserEntity> getByIds(List<Long> userIds);
}
