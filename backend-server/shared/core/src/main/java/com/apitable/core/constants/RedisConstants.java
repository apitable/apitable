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

package com.apitable.core.constants;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * Redis Capacity Key.
 * </p>
 */
public class RedisConstants {

    /**
     * login consecutive incorrect password times.
     */
    public static final String ERROR_PWD_NUM_DIR = "cache:login:error:";
    /**
     * user authorization information token.
     */
    public static final String USER_AUTH_INFO_TOKEN = "cache:auth:{}";
    /**
     * resource: menus are grouped with resources.
     */
    public static final String SPACE_MENU_RESOURCE_GROUP_KEY = "cache:resources:space:group";
    /**
     * general config ---> config:business type:config object.
     */
    public static final String GENERAL_CONFIG = "config:{}:{}";
    /**
     * geneal lock ---> business type:lock:lock object.
     */
    public static final String GENERAL_LOCKED = "{}:lock:{}";
    /**
     * general statistical value ---> statics:business type:config object.
     */
    public static final String GENERAL_STATICS = "statics:{}:{}";
    /**
     * version release notice ---> lock:lock object.
     */
    public static final String NOTIFICATION_LOCKED = "notify:lock:{}:{}";
    /**
     * notification ---> notification temporary ID.
     */
    public static final String NOTIFY_TEMPORARY_KEY = "notify:cache:temporary:{}";
    /**
     * storage structure of verification code ---> verification Code Type（SMS/EMAIL）：business type（login/register/...）：storage object（phone or email）
     */
    private static final String CAPTCHA_KEY = "captcha:{}:{}:{}";
    /**
     * scope of the verification code, corresponds to the global verification code service type ---> verification Code Type：scope：storage object.
     */
    private static final String CAPTCHA_SCOPE_KEY = "captcha:{}:scope:{}";
    /**
     * login user information.
     */
    private static final String LOGIN_USER_KEY = "cache:user:{}:information";
    /**
     * user's main active space ID.
     */
    private static final String USER_ACTIVE_SPACE_KEY = "cache:user:{}:space:active";
    /**
     * user corresponding space information.
     */
    private static final String USER_SPACE_KEY = "cache:user:{}:space:{}:information";
    /**
     * data table information opened by the user in the space.
     */
    private static final String USER_OPENED_SHEET_KEY = "cache:user:{}:space:{}:openedSheet";

    /**
     * members recently mentioned by users in the space.
     */
    private static final String USER_SPACE_REMIND_KEY = "cache:user:{}:space:{}:remind";
    /**
     * obtain the verification code record in the same service scenario, construction ---> business type：storage object(phone or email).
     */
    private static final String CAPTCHA_RECORD_KEY = "captcha:record:{}:{}";
    /**
     * records the success of verification code verification.
     */
    private static final String CAPTCHA_VALIDATE_SUCCESS_KEY = "captcha:validate:success:{}";
    /**
     * number of verification code errors.
     */
    private static final String CAPTCHA_VALIDATE_ERROR_NUM_KEY = "captcha:validate:error:{}";
    /**
     * send a verification code restricts the lock, lock object: phone or email.
     */
    private static final String SEND_CAPTCHA_LOCKED_KEY = "captcha:lock:{}";
    /**
     * number of verification codes sent.
     */
    private static final String SEND_CAPTCHA_COUNT_DIR = "captcha:count:";
    /**
     * space template reference.
     */
    private static final String SPACE_TEMPLATE_QUOTE = "template:quote:{}:{}";

    /**
     * notification frequency limit person/day.
     */
    private static final String NOTIFY_FREQUENCY_LIMIT = "notify:cache:frequency:{}:{}:{}";

    private static final String SPACE_AUTOMATION_RUN_COUNT_KEY =
        "cache:space:automation:count:{}:{}";

    /**
     * Get the key stored by the login user.
     *
     * @param userId user's id
     * @return login user storage key
     */
    public static String getLoginUserKey(Long userId) {
        Assert.notNull(userId, "user does not exist");
        return StrUtil.format(LOGIN_USER_KEY, userId);
    }

    /**
     * Get user active space.
     *
     * @param userId user's id
     * @return user information storage key
     */
    public static String getUserActiveSpaceKey(Long userId) {
        Assert.notNull(userId, "user does not exist");
        return StrUtil.format(USER_ACTIVE_SPACE_KEY, userId);
    }

    /**
     * Key for obtaining user space information storage.
     *
     * @param userId  user's id
     * @param spaceId space's id
     * @return user information storage key
     */
    public static String getUserSpaceKey(Long userId, String spaceId) {
        Assert.notNull(userId, "user does not exist");
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(USER_SPACE_KEY, userId, spaceId);
    }

    /**
     * Get the data table information opened by the user in the space.
     *
     * @param userId user's id
     * @return user information storage key
     */
    public static String getUserSpaceOpenedSheetKey(Long userId, String spaceId) {
        Assert.notNull(userId, "user does not exist");
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(USER_OPENED_SHEET_KEY, userId, spaceId);
    }

    /**
     * Get the member record recently mentioned by the user in the space.
     *
     * @param userId  user's id
     * @param spaceId space's id
     * @return user information storage key
     */
    public static String getUserSpaceRemindRecordKey(Long userId, String spaceId) {
        Assert.notNull(userId, "user does not exist");
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(USER_SPACE_REMIND_KEY, userId, spaceId);
    }

    /**
     * Get the key of verification code storage.
     *
     * @param codeType code type
     * @param scope    business type
     * @param target   phone number or email
     * @return key
     */
    public static String getCaptchaKey(String codeType, String scope, String target) {
        Assert.notBlank(codeType, "verification code type does not exist");
        Assert.notBlank(scope, "business type does not exist");
        Assert.notBlank(target, "sending object does not exist");
        return StrUtil.format(CAPTCHA_KEY, codeType, scope, target);
    }

    /**
     * Get the key of verification code scope storage.
     *
     * @param codeType code type
     * @param target   phone number or email
     * @return key
     */
    public static String getCaptchaScopeKey(String codeType, String target) {
        Assert.notBlank(codeType, "verification code type does not exist");
        Assert.notBlank(target, "business type does not exist");
        return StrUtil.format(CAPTCHA_SCOPE_KEY, codeType, target);
    }

    /**
     * Number of times to obtain verification code errors.
     *
     * @param target phone number or email
     * @return key
     */
    public static String getCaptchaValidateErrorNumKey(String target) {
        Assert.notBlank(target, "verification object does not exist");
        return StrUtil.format(CAPTCHA_VALIDATE_ERROR_NUM_KEY, target);
    }

    /**
     * Number of times to obtain verification code success.
     *
     * @param target phone number or email
     * @return key
     */
    public static String getCaptchaValidateSuccessKey(String target) {
        Assert.notBlank(target, "verification object does not exist");
        return StrUtil.format(CAPTCHA_VALIDATE_SUCCESS_KEY, target);
    }

    /**
     * Get the record of successful verification of verification code.
     *
     * @param target phone number or email
     * @return key
     */
    public static String getSendCaptchaRecordKey(String scope, String target) {
        Assert.notBlank(scope, "business type does not exist");
        Assert.notBlank(target, "record object does not exist");
        return StrUtil.format(CAPTCHA_RECORD_KEY, scope, target);
    }

    /**
     * Get the blacklist lock of sending verification code.
     *
     * @param target lock object: phone number or email
     * @return key
     */
    public static String getLockedKey(String target) {
        Assert.notBlank(target, "lock object does not exist");
        return StrUtil.format(SEND_CAPTCHA_LOCKED_KEY, target);
    }

    /**
     * Get the total number of verification codes sent by the specified type and object.
     *
     * @param target ip address, phone number or email
     * @param type   statistical type
     * @return key
     */
    public static String getSendCaptchaCountKey(String target, String type) {
        Assert.notBlank(target, "lock object does not exist");
        Assert.notBlank(type, "statistics type does not exist");
        return SEND_CAPTCHA_COUNT_DIR + type + ":" + target;
    }

    /**
     * Get the frequency of sending verification code for the specified object.
     *
     * @param target id address, phone number or email
     * @return key
     */
    public static String getSendCaptchaRateKey(String target) {
        Assert.notBlank(target, "The object recording frequency does not exist");
        return SEND_CAPTCHA_COUNT_DIR + target;
    }

    /**
     * Get notification message lock.
     *
     * @param templateId lock object: template id
     * @param version    lock object: version
     * @return String
     */
    public static String getNotificationLockedKey(String templateId, String version) {
        Assert.notNull(version, "lock object does not exist");
        return StrUtil.format(NOTIFICATION_LOCKED, templateId, version);
    }

    /**
     * Get the key corresponding to the notification userId and ID.
     *
     * @param keyId temporary notification ID
     * @return String
     */
    public static String getNotifyTemporaryKey(String keyId) {
        Assert.notBlank(keyId, "lock object does not exist");
        return StrUtil.format(NOTIFY_TEMPORARY_KEY, keyId);
    }

    /**
     * Get template reference key.
     *
     * @param spaceId space's id
     * @param nodeId  id of the file created after reference
     * @return String
     */
    public static String getTemplateQuoteKey(String spaceId, String nodeId) {
        Assert.notBlank(spaceId, "space does not exist");
        Assert.notBlank(nodeId, "file does not exist");
        return StrUtil.format(SPACE_TEMPLATE_QUOTE, spaceId, nodeId);
    }


    /**
     * Get the frequency key of user notification.
     *
     * @param userId     user's id
     * @param templateId notification template id
     * @param nonce      random string
     * @return String
     */
    public static String getUserNotifyFrequencyKey(Long userId, String templateId, String nonce) {
        Assert.notNull(userId, "user does not exist");
        Assert.notBlank(templateId, "notification template does not exist");
        return StrUtil.format(NOTIFY_FREQUENCY_LIMIT, templateId, userId, nonce);
    }

    /**
     * get the view count statics cache key.
     *
     * @param spaceId space id
     * @return string
     */
    public static String getGeneralStaticsOfViewKey(String spaceId) {
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(GENERAL_STATICS, "count:view", spaceId);
    }

    /**
     * get the record count statics cache key.
     *
     * @param spaceId space id
     * @return string
     */
    public static String getGeneralStaticsOfRecordKey(String spaceId) {
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(GENERAL_STATICS, "count:record", spaceId);
    }

    /**
     * get space automation run count statistics.
     *
     * @param spaceId space id
     * @return String
     */
    public static String getSpaceAutomationRunCountKey(String spaceId) {
        Integer month = DateUtil.date().month() + 1;
        Integer year = DateUtil.date().year();
        return StrUtil.format(SPACE_AUTOMATION_RUN_COUNT_KEY, spaceId,
            StrUtil.format("{}-{}", year, month));
    }

    /**
     * get space api usage statistics concurrent lock key.
     *
     * @return String
     */
    public static String getSpaceApiUsageConcurrentKey() {
        return StrUtil.format(GENERAL_LOCKED, "space", "api_usage");
    }

    public static String triggerUpdateLockKey(String triggerId) {
        return StrUtil.format(GENERAL_LOCKED, "trigger_update", triggerId);
    }

    /**
     * get api usage min id.
     *
     * @param date every day of begin time
     * @return key
     */
    public static String getApiUsageTableDayMindIdCacheKey(String date) {
        return StrUtil.format(GENERAL_STATICS, "api-usage-min-id-day", date);
    }
}
