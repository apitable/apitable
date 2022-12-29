package com.vikadata.core.constants;


import cn.hutool.core.lang.Assert;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * Redis Capacity Key
 * </p>
 *
 */
public class RedisConstants {

    public static final String REDIS_ENV = "redis_env";

    /**
     * login user information
     */
    private static final String LOGIN_USER_KEY = "vikadata:cache:user:{}:information";

    /**
     * user history
     * */
    private static final String LOGIN_USER_HISTORY = "vikadata:cache:user:{}:history";

    /**
     * user associated information
     */
    private static final String USER_LINK_INFO_KEY = "vikadata:cache:user:{}:linkedInfo";

    /**
     * user's main active space ID
     */
    private static final String USER_ACTIVE_SPACE_KEY = "vikadata:cache:user:{}:space:active";

    /**
     * user corresponding space information
     */
    private static final String USER_SPACE_KEY = "vikadata:cache:user:{}:space:{}:information";

    /**
     * data table information opened by the user in the space
     */
    private static final String USER_OPENED_SHEET_KEY = "vikadata:cache:user:{}:space:{}:openedSheet";

    /**
     * new users are invited to join the space station
     */
    private static final String NEW_USER_INVITED_JOIN_SPACE_KEY = "vikadata:cache:user{}:space{}:invited";

    /**
     * members recently mentioned by users in the space
     */
    private static final String USER_SPACE_REMIND_KEY = "vikadata:cache:user:{}:space:{}:remind";

    /**
     * storage structure of verification code ---> verification Code Type（SMS/EMAIL）：business type（login/register/...）：storage object（phone or email）
     */
    private static final String CAPTCHA_KEY = "vikadata:captcha:{}:{}:{}";

    /**
     * scope of the verification code, corresponds to the global verification code service type ---> verification Code Type：scope：storage object
     */
    private static final String CAPTCHA_SCOPE_KEY = "vikadata:captcha:{}:scope:{}";

    /**
     * obtain the verification code record in the same service scenario, construction ---> business type：storage object（phone or email）
     */
    private static final String CAPTCHA_RECORD_KEY = "vikadata:captcha:record:{}:{}";

    /**
     * records the success of verification code verification
     */
    private static final String CAPTCHA_VALIDATE_SUCCESS_KEY = "vikadata:captcha:validate:success:{}";

    /**
     * number of verification code errors
     */
    private static final String CAPTCHA_VALIDATE_ERROR_NUM_KEY = "vikadata:captcha:validate:error:{}";

    /**
     * send a verification code restricts the lock, lock object: phone or email
     */
    private static final String SEND_CAPTCHA_LOCKED_KEY = "vikadata:captcha:lock:{}";

    /**
     * number of verification codes sent
     */
    private static final String SEND_CAPTCHA_COUNT_DIR = "vikadata:captcha:count:";

    /**
     * login consecutive incorrect password times
     */
    public static final String ERROR_PWD_NUM_DIR = "vikadata:cache:login:error:";

    /**
     * user authorization information token
     */
    public static final String USER_AUTH_INFO_TOKEN = "vikadata:cache:auth:{}";

    /**
     * resource: menus are grouped with resources
     */
    public static final String SPACE_MENU_RESOURCE_GROUP_KEY = "vikadata:cache:resources:space:group";

    /**
     * WeChat widget, get session information after WeChat login
     */
    public static final String WECHAT_MINIAPP_AUTH_RESULT = "vikadata:wechat:miniapp:sessionInfo:{}";

    /**
     * WeChat widget, generates a unique identity for the scan login or associated widget code
     */
    public static final String WECHAT_MINIAPP_CODE_MARK = "vikadata:wechat:miniapp:qrcode:{}";

    /**
     * WeChat official account, page authorization callback code
     */
    public static final String WECHAT_MP_CODE_MARK = "vikadata:wechat:mp:code:{}";

    /**
     * WeChat official account, generate the unique identifier of the two-dimensional code
     */
    public static final String WECHAT_MP_QRCODE_MARK = "vikadata:wechat:mp:qrcode:{}";

    /**
     * general cumulative quantity ---> vikadata:business type:count:storage object
     */
    public static final String GENERAL_COUNT = "vikadata:{}:count:{}";

    /**
     * general config ---> vikadata:config:business type:config object
     */
    public static final String GENERAL_CONFIG = "vikadata:config:{}:{}";

    /**
     * geneal lock ---> vikadata:business type:lock:lock object
     */
    public static final String GENERAL_LOCKED = "vikadata:{}:lock:{}";

    /**
     * general statistical value ---> vikadata:statics:business type:config object
     */
    public static final String GENERAL_STATICS = "vikadata:statics:{}:{}";

    /**
     * share page ---> meta label after rending
     */
    public static final String INDEX_SHARE_META_CONTENT = "vikadata:cache:share:meta:{}";

    /**
     * version release notice ---> lock:lock object
     */
    public static final String NOTIFICATION_LOCKED = "vikadata:notify:lock:{}:{}";

    /**
     * invite registration record key value
     */
    public static final String INVITE_HISTORY_KEY = "vikadata:cache:invite:history:{}";

    /**
     * share page ---> meta label after rending
     */
    public static final String DATASHEET_CLIENT_VERSION_KEY = "vikadata:{" + REDIS_ENV + "}:cache:client:version";

    /**
     * notification ---> notification temporary ID
     */
    public static final String NOTIFY_TEMPORARY_KEY = "vikadata:notify:cache:temporary:{}";

    /**
     * DingTalk sync http Distributed lock key
     */
    public static final String DING_TALK_SYNC_HTTP_EVENT_LOCK_KEY = "vikadata:dingtalk:event:lock:{}:{}:{}:{}";

    /**
     * DingTalk template ID--logo key
     */
    public static final String DING_TALK_TEMPLATE_ICON_CACHE = "vikadata:dingtalk:cache:template:icon:{}";

    /**
     * DingTalk production information
     */
    public static final String DING_TALK_GOODS_INFO_CACHE = "vikadata:dingtalk:cache:goods:{}:{}";

    /**
     * DingTalk unprocessed order information
     */
    public static final String DING_TALK_UN_HANDLE_ORDER_INFO = "vikadata:dingtalk:cache:order:{}:{}";

    /**
     * DingTalk isv synchronizing address book
     */
    public static final String SOCIAL_CONTACT_LOCK = "vikadata:social:contact:lock:{}";

    public static final String WECOM_ISV_CONTACT_USER_GET_CACHE = "vikadata:wecom:isv:cache:contact:user_get:{}";

    public static final String WECOM_ISV_CONTACT_DEPART_LIST_CACHE = "vikadata:wecom:isv:cache:contact:depart_list:{}";

    public static final String WECOM_ISV_CONTACT_TAG_GET_CACHE = "vikadata:wecom:isv:cache:contact:tag_get:{}";

    public static final String WECOM_ISV_CONTACT_USER_SIMPLELIST_CACHE = "vikadata:wecom:isv:cache:contact:user_simplelist:{}";

    public static final String WECOM_ISV_MEMBER_NEW_LIST_CACHE = "vikadata:wecom:isv:cache:member:new_list:{}";

    /**
     * Lark unprocessed order information
     */
    public static final String LARK_UN_HANDLE_ORDER_INFO = "vikadata:social:lark:order:{}:{}";

    /**
     * space template reference
     */
    private static final String SPACE_TEMPLATE_QUOTE = "vikadata:template:quote:{}:{}";

    /**
     * notification frequency limit person/day
     */
    private static final String NOTIFY_FREQUENCY_LIMIT = "vikadata:notify:cache:frequency:{}:{}:{}";

    /**
     * kong List of grayscale stations required by the gateway
     * note that this is only used at the entry, do not use business code
     */
    public static final String KONG_GATEWAY_GRAY_SPACE = "vikadata:kong_gateway:gray_space";

    /**
     * social isv event lock
     */
    public static final String SOCIAL_ISV_EVENT_LOCK = "vikadata:social:isv:event:lock:{}:{}";

    /**
     * social isv event lock
     */
    public static final String SOCIAL_ISV_EVENT_PROCESSING = "vikadata:social:isv:event:processing:{}:{}";

    /**
     * Get the key stored by the login user
     *
     * @param userId user's id
     * @return login user storage key
     */
    public static String getLoginUserKey(Long userId) {
        Assert.notNull(userId, "user does not exist");
        return StrUtil.format(LOGIN_USER_KEY, userId);
    }

    /**
     * Get the key of user history storage
     *
     * @param userId user's id
     * @return login user history storage key
     * */
    public static String getLoginUserHistory(Long userId) {
        Assert.notNull(userId, "user does not exist");
        return StrUtil.format(LOGIN_USER_HISTORY, userId);
    }

    /**
     * Get the key of the user associated information store
     *
     * @param userId user's id
     * @return key
     */
    public static String getUserLinkInfoKey(Long userId) {
        Assert.notNull(userId, "user does not exist");
        return StrUtil.format(USER_LINK_INFO_KEY, userId);
    }

    /**
     * Get user active space
     *
     * @param userId user's id
     * @return user information storage key
     */
    public static String getUserActiveSpaceKey(Long userId) {
        Assert.notNull(userId, "user does not exist");
        return StrUtil.format(USER_ACTIVE_SPACE_KEY, userId);
    }

    /**
     * Key for obtaining user space information storage
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
     * Get the data table information opened by the user in the space
     *
     * @param userId  user's id
     * @return user information storage key
     */
    public static String getUserSpaceOpenedSheetKey(Long userId, String spaceId) {
        Assert.notNull(userId, "user does not exist");
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(USER_OPENED_SHEET_KEY, userId, spaceId);
    }

    /**
     * Get the information about new users being invited to join the space station
     *
     * @param userId  user's id
     * @param spaceId space's id
     * @return key
     */
    public static String getUserInvitedJoinSpaceKey(Long userId, String spaceId) {
        Assert.notNull(userId, "user does not exist");
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(NEW_USER_INVITED_JOIN_SPACE_KEY, userId, spaceId);
    }

    /**
     * Get the member record recently mentioned by the user in the space
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
     * Get the key of verification code storage
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
     * Get the key of verification code scope storage
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
     * Number of times to obtain verification code errors
     *
     * @param target phone number or email
     * @return key
     */
    public static String getCaptchaValidateErrorNumKey(String target) {
        Assert.notBlank(target, "verification object does not exist");
        return StrUtil.format(CAPTCHA_VALIDATE_ERROR_NUM_KEY, target);
    }

    /**
     * Number of times to obtain verification code success
     *
     * @param target phone number or email
     * @return key
     */
    public static String getCaptchaValidateSuccessKey(String target) {
        Assert.notBlank(target, "verification object does not exist");
        return StrUtil.format(CAPTCHA_VALIDATE_SUCCESS_KEY, target);
    }

    /**
     * Get the record of successful verification of verification code
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
     * Get the blacklist lock of sending verification code
     *
     * @param target lock object: phone number or email
     * @return key
     */
    public static String getLockedKey(String target) {
        Assert.notBlank(target, "lock object does not exist");
        return StrUtil.format(SEND_CAPTCHA_LOCKED_KEY, target);
    }

    /**
     * Get the total number of verification codes sent by the specified type and object
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
     * Get the frequency of sending verification code for the specified object
     *
     * @param target id address, phone number or email
     * @return key
     */
    public static String getSendCaptchaRateKey(String target) {
        Assert.notBlank(target, "The object recording frequency does not exist");
        return SEND_CAPTCHA_COUNT_DIR + target;
    }

    /**
     * Get notification message lock
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
     * Get notification message lock
     *
     * @param recordId invite history id
     * @return String
     */
    public static String getInviteHistoryKey(String recordId) {
        Assert.notBlank(recordId, "records are not allowed to be empty");
        return StrUtil.format(INVITE_HISTORY_KEY, recordId);
    }

    /**
     * Get the homepage meta cache key
     *
     * @param keyId shareId or tmpId
     * @return String
     */
    public static String getEntryMetaKey(String keyId) {
        Assert.notBlank(keyId, "lock object does not exist");
        return StrUtil.format(INDEX_SHARE_META_CONTENT, keyId);
    }

    /**
     * Get the key corresponding to the notification userId and ID
     * @param keyId temporary notification ID
     * @return String
     */
    public static String getNotifyTemporaryKey(String keyId) {
        Assert.notBlank(keyId, "lock object does not exist");
        return StrUtil.format(NOTIFY_TEMPORARY_KEY, keyId);
    }

    /**
     * Get DingTalk distributed event key
     *
     * @param subscribeId subscriber
     * @param corpId enterprise
     * @param bizId business data id
     * @param bizType business type
     * @return String
     */
    public static String getDingTalkSyncHttpEventLockKey(String subscribeId, String corpId, String bizId,
            Integer bizType) {
        return StrUtil.format(DING_TALK_SYNC_HTTP_EVENT_LOCK_KEY, subscribeId, corpId, bizId, bizType);
    }

    /**
     * Get DingTalk template icon storage key
     *
     * @param templateId tempalate id
     * @return String
     */
    public static String getDingTalkTemplateIconKey(String templateId) {
        return StrUtil.format(DING_TALK_TEMPLATE_ICON_CACHE, templateId);
    }

    /**
     * Get DingTalk commodity key
     *
     * @param skuCode DingTalk sku code
     * @param period cycle
     * @return String
     */
    public static String getDingTalkGoodsInfoKey(String skuCode, String period) {
        return StrUtil.format(DING_TALK_GOODS_INFO_CACHE, skuCode, period);
    }

    /**
     * Get DingTalk unprocessed order key
     *
     * @param suiteId application id
     * @param corpId enterprise id
     * @return String
     */
    public static String getDingTalkUnHandleOrderInfoKey(String suiteId, String corpId) {
        return StrUtil.format(DING_TALK_UN_HANDLE_ORDER_INFO, suiteId, corpId);
    }

    /**
     * Get the DingTalk address book synchronization lock
     *
     * @param spaceId space's id
     * @return String
     */
    public static String getSocialContactLockKey(String spaceId) {
        Assert.notBlank(spaceId, "space does not exist");
        return StrUtil.format(SOCIAL_CONTACT_LOCK, spaceId);
    }

    /**
     * Get the cache key of the enterprise WeChat third-party service provider's address book operation
     *
     * @param authCorpId  authorized enterprise id
     * @return cache key
     */
    public static String getWecomIsvContactUserGetKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_USER_GET_CACHE, authCorpId);

    }

    /**
     * Get the cache key of the enterprise WeChat third-party service provider's address book operation
     *
     * @param authCorpId authorized enterprise id
     * @return cache key
     */
    public static String getWecomIsvContactDepartListKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_DEPART_LIST_CACHE, authCorpId);

    }

    /**
     * Get the cache key of the enterprise WeChat third-party service provider's address book operation
     *
     * @param authCorpId authorized enterprise id
     * @return cache key
     */
    public static String getWecomIsvContactTagGetKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_TAG_GET_CACHE, authCorpId);

    }

    /**
     * Get the cache key of the enterprise WeChat third-party service provider's address book operation
     *
     * @param authCorpId authorized enterprise id
     * @return cache key
     */
    public static String getWecomIsvContactUserSimpleListKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_USER_SIMPLELIST_CACHE, authCorpId);

    }

    /**
     * Get the cache key of new members of the WeChat third-party service provider's address book
     *
     * @param authCorpId authorized enterprise id
     * @return cache key
     */
    public static String getWecomIsvMemberNewListKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_MEMBER_NEW_LIST_CACHE, authCorpId);

    }

    /**
     * Get Lark Unprocessed Order Key
     *
     * @param tenantKey enterprise id
     */
    public static String getLarkUnHandleOrderInfoKey(String appId, String tenantKey) {
        return StrUtil.format(LARK_UN_HANDLE_ORDER_INFO, appId, tenantKey);
    }

    /**
     * Get template reference key
     *
     * @param spaceId space's id
     * @param nodeId id of the file created after reference
     * @return String
     */
    public static String getTemplateQuoteKey(String spaceId, String nodeId) {
        Assert.notBlank(spaceId, "space does not exist");
        Assert.notBlank(nodeId, "file does not exist");
        return StrUtil.format(SPACE_TEMPLATE_QUOTE, spaceId, nodeId);
    }

    /**
     * Get the frequency key of user notification
     *
     * @param userId user's id
     * @param templateId notification template id
     * @param nonce random string
     * @return String
     */
    public static String getUserNotifyFrequencyKey(Long userId, String templateId, String nonce) {
        Assert.notNull(userId, "user does not exist");
        Assert.notBlank(templateId, "notification template does not exist");
        return StrUtil.format(NOTIFY_FREQUENCY_LIMIT, templateId, userId, nonce);
    }


    /**
     * social isv event lock
     *
     * @param tenantId tenant's id
     * @param appId application's id
     * @return String
     */
    public static String getSocialIsvEventLockKey(String tenantId, String appId) {
        Assert.notNull(tenantId, "tenant not null");
        Assert.notBlank(appId, "tenant app not null");
        return StrUtil.format(SOCIAL_ISV_EVENT_LOCK, tenantId, appId);
    }

    /**
     * Get social isv event lock
     *
     * @param tenantId tenant's id
     * @param appId application's id
     * @return String
     */
    public static String getSocialIsvEventProcessingKey(String tenantId, String appId) {
        Assert.notNull(tenantId, "tenant not null");
        Assert.notBlank(appId, "tenant app not null");
        return StrUtil.format(SOCIAL_ISV_EVENT_PROCESSING, tenantId, appId);
    }
}
