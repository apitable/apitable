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

package com.apitable.user.mapper;

import com.apitable.space.vo.InviteUserInfo;
import com.apitable.user.dto.UserInPausedDto;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.dto.UserSensitiveDTO;
import com.apitable.user.entity.UserEntity;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.cursor.Cursor;

/**
 * <p>
 * User Table Mapper Interface.
 * </p>
 */
public interface UserMapper extends BaseMapper<UserEntity> {

    /**
     * Query user's name according to ID.
     *
     * @param userId ID Primary Key
     * @return User Name
     */
    String selectNickNameById(@Param("userId") Long userId);

    /**
     * Query email.
     *
     * @param userId User ID
     * @return email email
     */
    String selectEmailById(@Param("userId") Long userId);

    /**
     * Query avatar.
     *
     * @param userId user id
     * @return avatar
     * @author Chambers
     */
    String selectAvatarById(@Param("userId") Long userId);

    /**
     * Get User ID through Phone number.
     *
     * @param mobilePhone Phone number
     * @return User ID
     */
    Long selectIdByMobile(@Param("mobilePhone") String mobilePhone);

    /**
     * Obtain User ID through email.
     *
     * @param email mail
     * @return User ID
     */
    Long selectIdByEmail(@Param("email") String email);

    /**
     * Get users through Phone number.
     *
     * @param mobilePhone Phone number
     * @return User ID
     */
    UserEntity selectByMobile(@Param("mobilePhone") String mobilePhone);

    /**
     * Batch query users through Phone number.
     *
     * @param mobilePhones Phone number list
     * @return UserEntities
     */
    List<UserEntity> selectByMobilePhoneIn(@Param("mobilePhones") Collection<String> mobilePhones);

    /**
     * Query users according to email.
     *
     * @param email email
     * @return user
     */
    UserEntity selectByEmail(@Param("email") String email);

    /**
     * Query quantity according to email.
     *
     * @param email email
     * @return count
     */
    Integer selectCountByEmail(@Param("email") String email);

    /**
     * Batch query users according to email.
     *
     * @param emails email list
     * @return entities
     */
    List<UserEntity> selectByEmails(@Param("emails") Collection<String> emails);

    /**
     * Query user ID according to uuid.
     *
     * @param uuid External System ID
     * @return User's ID
     */
    Long selectIdByUuid(@Param("uuid") String uuid);

    /**
     * Query user ID according to uuid.
     *
     * @param uuidList Uuid column of users
     * @return User's ID
     */
    List<Long> selectIdByUuidList(@Param("uuidList") List<String> uuidList);

    /**
     * Query uuid according to user ID.
     *
     * @param id Datasheet ID
     * @return uuid
     */
    String selectUuidById(@Param("id") Long id);

    /**
     * Query by User ID.
     *
     * @param userIds User ID
     * @return {@link UserEntity}
     */
    List<UserEntity> selectByIds(@Param("userIds") List<Long> userIds);

    /**
     * query userEntity by uuid.
     *
     * @param uuids user's uuid
     * @return UserEntity
     */
    List<UserEntity> selectByUuIds(@Param("uuids") List<String> uuids);

    /**
     * todo Want to add created at as an index, and then partition according to time when there is a large amount of data
     * The cursor queries all user IDs of the current time.
     *
     * @param ignoreDelete Ignore Delete
     * @return Long
     */
    @InterceptorIgnore(illegalSql = "true")
    Cursor<Long> selectAllUserIdByIgnoreDelete(@Param("ignoreDelete") boolean ignoreDelete);

    /**
     * Modify user's mobile number.
     *
     * @param userId User ID
     * @return Number of rows affected
     */
    int resetMobileByUserId(@Param("userId") Long userId);

    /**
     * Modify user email.
     *
     * @param userId User ID
     * @return Number of rows affected
     */
    int resetEmailByUserId(@Param("userId") Long userId);

    /**
     * Reset user information
     * Reset field: code、mobile、email、is_deleted.
     *
     * @param userId User ID
     * @return Number of affected record lines
     */
    int resetUserById(@Param("userId") Long userId);

    /**
     * update user avatar information.
     *
     * @param userId User ID
     * @param avatar User avatar
     * @param color  User default avatar color number
     */
    int updateUserAvatarInfo(@Param("userId") Long userId, @Param("avatar") String avatar,
                             @Param("color") Integer color);

    /**
     * Batch query member email.
     *
     * @param userIds User ID Collection
     * @return Mail Address List
     */
    List<String> selectEmailByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * <p>
     * Query the user id and set language according to the mail.<br/>
     * Methods Use IN to query in batches. If there is too much data, pay attention to searching in batches.<br/>
     * If the locale is empty, it will be set to default Locale.<br/>
     * <strong>
     * Note: The SQL statement IFNULL is dialect, that is, the project may have errors connecting to non mysql databases.
     * </strong>
     * </p>
     *
     * @param defaultLocale Default language
     * @param emails        List of emails found
     * @return email、id、locale List
     */
    List<UserLangDTO> selectLocaleInEmailsWithDefaultLocale(
        @Param("defaultLocale") String defaultLocale, @Param("emails") List<String> emails);

    /**
     * Query the user id and set language according to the mail.
     *
     * @param email Email
     * @return email、id、locale
     */
    UserLangDTO selectLocaleByEmail(@Param("email") String email);

    /**
     * <p>
     * Query the user id and set language according to the mail.<br/>
     * If the locale is empty, it will be set to default Locale<br/>
     * <strong>
     * Note: The SQL statement IFNULL is dialect, that is, the project may have errors connecting to non mysql databases.
     * </strong>
     * </p>
     *
     * @param defaultLocale Default language
     * @param email         email
     * @return email、id、locale
     */
    UserLangDTO selectLocaleByEmailWithDefaultLocale(@Param("defaultLocale") String defaultLocale,
                                                     @Param("email") String email);

    /**
     * Query user language according to user ID.
     *
     * @param ids userId
     * @return UserLangDTO
     */
    List<UserLangDTO> selectLocaleAndEmailByIds(@Param("ids") List<Long> ids);

    /**
     * Batch acquisition of account information in the calm period.
     *
     * @param userIds User ID List
     * @return UserInPausedDto List
     */
    List<UserInPausedDto> selectPausedUsers(@Param("ids") List<Long> userIds);

    /**
     * Obtain the invited user information according to the User ID.
     *
     * @param userId User ID
     * @return inviteUserInfo Invite user information
     */
    InviteUserInfo selectInviteUserInfoByUserId(@Param("userId") Long userId);

    /**
     * query user sensitive information.
     *
     * @param userIds user ids.
     * @return UserSensitiveDTO
     */
    List<UserSensitiveDTO> selectEmailAndMobilePhoneByIds(@Param("userIds") List<Long> userIds);
}
