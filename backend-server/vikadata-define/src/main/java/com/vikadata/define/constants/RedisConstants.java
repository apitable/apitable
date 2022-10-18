package com.vikadata.define.constants;


import cn.hutool.core.lang.Assert;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * Redis存储键Key
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/27 15:02
 */
public class RedisConstants {

    public static final String REDIS_ENV = "redis_env";

    /**
     * 登录用户信息
     */
    private static final String LOGIN_USER_KEY = "vikadata:cache:user:{}:information";

    /**
     * 用户历史记录
     * */
    private static final String LOGIN_USER_HISTORY = "vikadata:cache:user:{}:history";

    /**
     * 用户关联信息
     */
    private static final String USER_LINK_INFO_KEY = "vikadata:cache:user:{}:linkedInfo";

    /**
     * 用户主活跃空间ID
     */
    private static final String USER_ACTIVE_SPACE_KEY = "vikadata:cache:user:{}:space:active";

    /**
     * 用户对应空间信息
     */
    private static final String USER_SPACE_KEY = "vikadata:cache:user:{}:space:{}:information";

    /**
     * 用户在空间内打开的数表信息
     */
    private static final String USER_OPENED_SHEET_KEY = "vikadata:cache:user:{}:space:{}:openedSheet";

    /**
     * 新用户被邀请加入空间站
     */
    private static final String NEW_USER_INVITED_JOIN_SPACE_KEY = "vikadata:cache:user{}:space{}:invited";

    /**
     * 用户在空间内最近提及的成员
     */
    private static final String USER_SPACE_REMIND_KEY = "vikadata:cache:user:{}:space:{}:remind";

    /**
     * 验证码存储结构 ---> 验证码类型（SMS/EMAIL）：业务类型（login/register/...）：存储对象（手机号或邮箱）
     */
    private static final String CAPTCHA_KEY = "vikadata:captcha:{}:{}:{}";

    /**
     * 验证码作用域，对应全局验证码业务类型 ---> 验证码类型：scope：存储对象
     */
    private static final String CAPTCHA_SCOPE_KEY = "vikadata:captcha:{}:scope:{}";

    /**
     * 同个业务场景下获取验证码的记录，结构 ---> 业务类型：存储对象（手机号或邮箱）
     */
    private static final String CAPTCHA_RECORD_KEY = "vikadata:captcha:record:{}:{}";

    /**
     * 验证码校验成功记录
     */
    private static final String CAPTCHA_VALIDATE_SUCCESS_KEY = "vikadata:captcha:validate:success:{}";

    /**
     * 验证码校验错误的次数
     */
    private static final String CAPTCHA_VALIDATE_ERROR_NUM_KEY = "vikadata:captcha:validate:error:{}";

    /**
     * 发送验证码限制锁定，锁定对象：手机号或邮箱
     */
    private static final String SEND_CAPTCHA_LOCKED_KEY = "vikadata:captcha:lock:{}";

    /**
     * 验证码发送数量
     */
    private static final String SEND_CAPTCHA_COUNT_DIR = "vikadata:captcha:count:";

    /**
     * 登陆连续输错密码次数
     */
    public static final String ERROR_PWD_NUM_DIR = "vikadata:cache:login:error:";

    /**
     * 用户授权信息令牌
     */
    public static final String USER_AUTH_INFO_TOKEN = "vikadata:cache:auth:{}";

    /**
     * 资源：菜单与资源分组
     */
    public static final String SPACE_MENU_RESOURCE_GROUP_KEY = "vikadata:cache:resources:space:group";

    /**
     * 微信小程序，wx.login后获取session信息
     */
    public static final String WECHAT_MINIAPP_AUTH_RESULT = "vikadata:wechat:miniapp:sessionInfo:{}";

    /**
     * 微信小程序，生成扫码登录或关联小程序码的唯一标识
     */
    public static final String WECHAT_MINIAPP_CODE_MARK = "vikadata:wechat:miniapp:qrcode:{}";

    /**
     * 微信公众号，网页授权回调 code
     */
    public static final String WECHAT_MP_CODE_MARK = "vikadata:wechat:mp:code:{}";

    /**
     * 微信公众号，生成二维码的唯一标识
     */
    public static final String WECHAT_MP_QRCODE_MARK = "vikadata:wechat:mp:qrcode:{}";

    /**
     * 通用累计数量 ---> vikadata:业务类型:count:存储对象
     */
    public static final String GENERAL_COUNT = "vikadata:{}:count:{}";

    /**
     * 通用配置 ---> vikadata:config:业务类型:配置对象
     */
    public static final String GENERAL_CONFIG = "vikadata:config:{}:{}";

    /**
     * 通用锁定 ---> vikadata:业务类型:lock:锁定对象
     */
    public static final String GENERAL_LOCKED = "vikadata:{}:lock:{}";

    /**
     * 通用统计数值 ---> vikadata:statics:业务类型:配置对象
     */
    public static final String GENERAL_STATICS = "vikadata:statics:{}:{}";

    /**
     * 分享页 ---> 渲染之后的meta标签
     */
    public static final String INDEX_SHARE_META_CONTENT = "vikadata:cache:share:meta:{}";

    /**
     * 版本发布通知 ---> lock:锁定对象
     */
    public static final String NOTIFICATION_LOCKED = "vikadata:notify:lock:{}:{}";

    /**
     * 邀请注册记录键值
     */
    public static final String INVITE_HISTORY_KEY = "vikadata:cache:invite:history:{}";

    /**
     * 分享页 ---> 渲染之后的meta标签
     */
    public static final String DATASHEET_CLIENT_VERSION_KEY = "vikadata:{" + REDIS_ENV + "}:cache:client:version";

    /**
     * 通知 ---> 通知临时ID
     */
    public static final String NOTIFY_TEMPORARY_KEY = "vikadata:notify:cache:temporary:{}";

    /**
     * 钉钉sync http 分布式锁的key
     */
    public static final String DING_TALK_SYNC_HTTP_EVENT_LOCK_KEY = "vikadata:dingtalk:event:lock:{}:{}:{}:{}";

    /**
     * 钉钉搭模版ID--logo key
     */
    public static final String DING_TALK_TEMPLATE_ICON_CACHE = "vikadata:dingtalk:cache:template:icon:{}";

    /**
     * 钉钉商品信息
     */
    public static final String DING_TALK_GOODS_INFO_CACHE = "vikadata:dingtalk:cache:goods:{}:{}";

    /**
     * 钉钉未处理的订单信息
     */
    public static final String DING_TALK_UN_HANDLE_ORDER_INFO = "vikadata:dingtalk:cache:order:{}:{}";

    /**
     * 钉钉isv正在同步通讯录
     */
    public static final String SOCIAL_CONTACT_LOCK = "vikadata:social:contact:lock:{}";

    public static final String WECOM_ISV_CONTACT_USER_GET_CACHE = "vikadata:wecom:isv:cache:contact:user_get:{}";

    public static final String WECOM_ISV_CONTACT_DEPART_LIST_CACHE = "vikadata:wecom:isv:cache:contact:depart_list:{}";

    public static final String WECOM_ISV_CONTACT_TAG_GET_CACHE = "vikadata:wecom:isv:cache:contact:tag_get:{}";

    public static final String WECOM_ISV_CONTACT_USER_SIMPLELIST_CACHE = "vikadata:wecom:isv:cache:contact:user_simplelist:{}";

    public static final String WECOM_ISV_MEMBER_NEW_LIST_CACHE = "vikadata:wecom:isv:cache:member:new_list:{}";

    /**
     * 飞书未处理的订单信息
     */
    public static final String LARK_UN_HANDLE_ORDER_INFO = "vikadata:social:lark:order:{}:{}";

    /**
     * 空间站模版引用
     */
    private static final String SPACE_TEMPLATE_QUOTE = "vikadata:template:quote:{}:{}";

    /**
     * 通知频率限制 人/天
     */
    private static final String NOTIFY_FREQUENCY_LIMIT = "vikadata:notify:cache:frequency:{}:{}:{}";

    /**
     * kong 网关需要的灰度空间站列表
     * 注意这个只是使用在 entry 入口，业务代码不要使用
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
     * 获取登录用户存储的键
     *
     * @param userId 用户ID
     * @return 返回登录用户存储的键
     * @author Shawn Deng
     * @date 2019/11/12 17:43
     */
    public static String getLoginUserKey(Long userId) {
        Assert.notNull(userId, "用户不存在");
        return StrUtil.format(LOGIN_USER_KEY, userId);
    }

    /**
     * 获取用户历史记录存储的键
     *
     * @param userId 用户ID
     * @return 返回登录用户历史存储的键
     * @author 胡海平(Humphrey Hu)
     * @date 2022/01/02 21:44
     * */
    public static String getLoginUserHistory(Long userId) {
        Assert.notNull(userId, "用户不存在");
        return StrUtil.format(LOGIN_USER_HISTORY, userId);
    }

    /**
     * 获取用户关联信息存储的键
     *
     * @param userId 用户ID
     * @return key
     * @author Chambers
     * @date 2020/8/26
     */
    public static String getUserLinkInfoKey(Long userId) {
        Assert.notNull(userId, "用户不存在");
        return StrUtil.format(USER_LINK_INFO_KEY, userId);
    }

    /**
     * 获取用户活跃空间
     *
     * @param userId 用户ID
     * @return 返回用户信息存储的键
     * @author Shawn Deng
     * @date 2019/11/12 17:43
     */
    public static String getUserActiveSpaceKey(Long userId) {
        Assert.notNull(userId, "用户不存在");
        return StrUtil.format(USER_ACTIVE_SPACE_KEY, userId);
    }

    /**
     * 获取用户空间信息存储的键
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 返回用户信息存储的键
     * @author Shawn Deng
     * @date 2019/11/12 17:43
     */
    public static String getUserSpaceKey(Long userId, String spaceId) {
        Assert.notNull(userId, "用户不存在");
        Assert.notBlank(spaceId, "空间不存在");
        return StrUtil.format(USER_SPACE_KEY, userId, spaceId);
    }

    /**
     * 获取用户在空间内打开的数表信息
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 返回用户信息存储的键
     * @author Shawn Deng
     * @date 2019/11/12 17:43
     */
    public static String getUserSpaceOpenedSheetKey(Long userId, String spaceId) {
        Assert.notNull(userId, "用户不存在");
        Assert.notBlank(spaceId, "空间不存在");
        return StrUtil.format(USER_OPENED_SHEET_KEY, userId, spaceId);
    }

    /**
     * 获取新用户被邀请加入空间站信息
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 存储的键
     * @author liuzijing
     * @date 2022/8/11
     */
    public static String getUserInvitedJoinSpaceKey(Long userId, String spaceId) {
        Assert.notNull(userId, "用户不存在");
        Assert.notBlank(spaceId, "空间不存在");
        return StrUtil.format(NEW_USER_INVITED_JOIN_SPACE_KEY, userId, spaceId);
    }


    /**
     * 获取用户在空间内最近提及的成员记录
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 返回用户信息存储的键
     * @author Chambers
     * @date 2020/5/27
     */
    public static String getUserSpaceRemindRecordKey(Long userId, String spaceId) {
        Assert.notNull(userId, "用户不存在");
        Assert.notBlank(spaceId, "空间不存在");
        return StrUtil.format(USER_SPACE_REMIND_KEY, userId, spaceId);
    }

    /**
     * 获取验证码存储的键
     *
     * @param codeType 验证码类型
     * @param scope    业务类型
     * @param target   手机号码或邮箱
     * @return 返回存储的键
     * @author Shawn Deng
     * @date 2019/12/25 14:51
     */
    public static String getCaptchaKey(String codeType, String scope, String target) {
        Assert.notBlank(codeType, "验证码类型不存在");
        Assert.notBlank(scope, "业务类型不存在");
        Assert.notBlank(target, "发送对象不存在");
        return StrUtil.format(CAPTCHA_KEY, codeType, scope, target);
    }

    /**
     * 获取验证码作用域存储的键
     *
     * @param codeType 验证码类型
     * @param target   手机号码或邮箱
     * @return 返回存储的键
     * @author Shawn Deng
     * @date 2019/12/25 14:51
     */
    public static String getCaptchaScopeKey(String codeType, String target) {
        Assert.notBlank(codeType, "验证码类型不存在");
        Assert.notBlank(target, "发送对象不存在");
        return StrUtil.format(CAPTCHA_SCOPE_KEY, codeType, target);
    }

    /**
     * 获取验证码校验错误的次数
     *
     * @param target 手机号码或邮箱
     * @return 返回存储的键
     * @author Shawn Deng
     * @date 2019/12/25 14:51
     */
    public static String getCaptchaValidateErrorNumKey(String target) {
        Assert.notBlank(target, "校验对象不存在");
        return StrUtil.format(CAPTCHA_VALIDATE_ERROR_NUM_KEY, target);
    }

    /**
     * 获取验证码校验成功的记录
     *
     * @param target 手机号码或邮箱
     * @return 返回存储的键
     * @author Shawn Deng
     * @date 2019/12/25 14:51
     */
    public static String getCaptchaValidateSuccessKey(String target) {
        Assert.notBlank(target, "校验对象不存在");
        return StrUtil.format(CAPTCHA_VALIDATE_SUCCESS_KEY, target);
    }

    /**
     * 同个业务场景下获取验证码的记录
     *
     * @param scope  业务类型
     * @param target 手机号码或邮箱
     * @return 返回存储的键
     * @author Shawn Deng
     * @date 2019/12/25 14:51
     */
    public static String getSendCaptchaRecordKey(String scope, String target) {
        Assert.notBlank(scope, "业务类型不存在");
        Assert.notBlank(target, "记录对象不存在");
        return StrUtil.format(CAPTCHA_RECORD_KEY, scope, target);
    }

    /**
     * 获取发送验证码黑名单锁定
     *
     * @param target 锁定对象：手机号码或邮箱
     * @return 返回存储的键
     * @author Shawn Deng
     * @date 2019/12/25 14:51
     */
    public static String getLockedKey(String target) {
        Assert.notBlank(target, "锁定对象不存在");
        return StrUtil.format(SEND_CAPTCHA_LOCKED_KEY, target);
    }

    /**
     * 获取指定类型和对象发送验证码的数量总数
     *
     * @param target IP地址，手机号码或邮箱
     * @param type   统计类型
     * @return 存储键
     * @author Shawn Deng
     * @date 2019/12/25 16:06
     */
    public static String getSendCaptchaCountKey(String target, String type) {
        Assert.notBlank(target, "锁定对象不存在");
        Assert.notBlank(type, "统计类型不存在");
        return SEND_CAPTCHA_COUNT_DIR + type + ":" + target;
    }

    /**
     * 获取指定对象发送验证码的频率
     *
     * @param target IP地址，手机号码或邮箱
     * @return 存储键
     * @author Shawn Deng
     * @date 2019/12/25 16:06
     */
    public static String getSendCaptchaRateKey(String target) {
        Assert.notBlank(target, "记录频率的对象不存在");
        return SEND_CAPTCHA_COUNT_DIR + target;
    }

    /**
     * 获取通知消息锁
     *
     * @param templateId 锁定对象 模版ID
     * @param version    锁定对象 版本号
     * @return String
     * @author zoe zheng
     * @date 2020/11/18 7:37 下午
     */
    public static String getNotificationLockedKey(String templateId, String version) {
        Assert.notNull(version, "锁定对象不存在");
        return StrUtil.format(NOTIFICATION_LOCKED, templateId, version);
    }

    /**
     * 获取通知消息锁
     *
     * @param recordId 邀请记录ID
     * @return String
     * @author zoe zheng
     * @date 2020/11/18 7:37 下午
     */
    public static String getInviteHistoryKey(String recordId) {
        Assert.notBlank(recordId, "记录不允许为空");
        return StrUtil.format(INVITE_HISTORY_KEY, recordId);
    }

    /**
     * 获取首页meta缓存key
     * @param keyId shareId或者tmpId
     * @return String
     * @author zoe zheng
     * @date 2021/2/3 7:40 下午
     */
    public static String getEntryMetaKey(String keyId) {
        Assert.notBlank(keyId, "锁定对象不存在");
        return StrUtil.format(INDEX_SHARE_META_CONTENT, keyId);
    }

    /**
     * 获取通知userId和ID对应的key
     * @param keyId 临时的通知ID
     * @return String
     * @author zoe zheng
     * @date 2021/2/3 7:40 下午
     */
    public static String getNotifyTemporaryKey(String keyId) {
        Assert.notBlank(keyId, "锁定对象不存在");
        return StrUtil.format(NOTIFY_TEMPORARY_KEY, keyId);
    }

    /**
     * 获取钉钉分布式事件key
     *
     * @param subscribeId 订阅者
     * @param corpId 企业
     * @param bizId 业务数据ID
     * @param bizType 业务类目
     * @return String
     * @author zoe zheng
     * @date 2021/9/28 13:48
     */
    public static String getDingTalkSyncHttpEventLockKey(String subscribeId, String corpId, String bizId,
            Integer bizType) {
        return StrUtil.format(DING_TALK_SYNC_HTTP_EVENT_LOCK_KEY, subscribeId, corpId, bizId, bizType);
    }

    /**
     * 获取钉钉模版icon存储key
     *
     * @param templateId 模版ID
     * @return String
     * @author zoe zheng
     * @date 2021/9/28 13:48
     */
    public static String getDingTalkTemplateIconKey(String templateId) {
        return StrUtil.format(DING_TALK_TEMPLATE_ICON_CACHE, templateId);
    }

    /**
     * 获取钉钉商品key
     *
     * @param skuCode 钉钉的sku编码
     * @param period 周期
     * @return String
     * @author zoe zheng
     * @date 2021/9/28 13:48
     */
    public static String getDingTalkGoodsInfoKey(String skuCode, String period) {
        return StrUtil.format(DING_TALK_GOODS_INFO_CACHE, skuCode, period);
    }

    /**
     * 获取钉钉未处理订单key
     *
     * @param suiteId 应用ID
     * @param corpId 企业ID
     * @return String
     * @author zoe zheng
     * @date 2021/11/29 2:35 下午
     */
    public static String getDingTalkUnHandleOrderInfoKey(String suiteId, String corpId) {
        return StrUtil.format(DING_TALK_UN_HANDLE_ORDER_INFO, suiteId, corpId);
    }

    /**
     * 获取钉钉通讯录同步锁
     *
     * @param spaceId 空间站ID
     * @return String
     * @author zoe zheng
     * @date 2021/11/29 2:36 下午
     */
    public static String getSocialContactLockKey(String spaceId) {
        Assert.notBlank(spaceId, "空间不存在");
        return StrUtil.format(SOCIAL_CONTACT_LOCK, spaceId);
    }

    /**
     * 获取企业微信第三方服务商通讯录操作的缓存 Key
     *
     * @param authCorpId 授权的企业 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-01-18 17:02:33
     */
    public static String getWecomIsvContactUserGetKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_USER_GET_CACHE, authCorpId);

    }

    /**
     * 获取企业微信第三方服务商通讯录操作的缓存 Key
     *
     * @param authCorpId 授权的企业 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-01-18 17:02:33
     */
    public static String getWecomIsvContactDepartListKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_DEPART_LIST_CACHE, authCorpId);

    }

    /**
     * 获取企业微信第三方服务商通讯录操作的缓存 Key
     *
     * @param authCorpId 授权的企业 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-01-18 17:02:33
     */
    public static String getWecomIsvContactTagGetKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_TAG_GET_CACHE, authCorpId);

    }

    /**
     * 获取企业微信第三方服务商通讯录操作的缓存 Key
     *
     * @param authCorpId 授权的企业 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-01-18 17:02:33
     */
    public static String getWecomIsvContactUserSimpleListKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_CONTACT_USER_SIMPLELIST_CACHE, authCorpId);

    }

    /**
     * 获取企业微信第三方服务商通讯录新增成员的缓存 Key
     *
     * @param authCorpId 授权的企业 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-02-18 11:34:40
     */
    public static String getWecomIsvMemberNewListKey(String authCorpId) {

        return CharSequenceUtil.format(WECOM_ISV_MEMBER_NEW_LIST_CACHE, authCorpId);

    }


    /**
     * 获取飞书未处理订单key
     * @param tenantKey 企业ID
     */
    public static String getLarkUnHandleOrderInfoKey(String appId, String tenantKey) {
        return StrUtil.format(LARK_UN_HANDLE_ORDER_INFO, appId, tenantKey);
    }

    /**
     * 获取模版引用key
     * @param spaceId 空间站ID
     * @param nodeId 引用后创建的文件ID
     * @return String
     * @author zoe zheng
     * @date 2021/12/14 5:42 PM
     */
    public static String getTemplateQuoteKey(String spaceId, String nodeId) {
        Assert.notBlank(spaceId, "空间不存在");
        Assert.notBlank(nodeId, "文件不存在");
        return StrUtil.format(SPACE_TEMPLATE_QUOTE, spaceId, nodeId);
    }

    /**
     * 获取用户发送通知频率key
     * @param userId 用户ID
     * @param templateId 通知模版ID
     * @param nonce 随机字符串
     * @return String
     * @author zoe zheng
     * @date 2022/2/23 19:32
     */
    public static String getUserNotifyFrequencyKey(Long userId, String templateId, String nonce) {
        Assert.notNull(userId, "用户不存在");
        Assert.notBlank(templateId, "通知模版不存在");
        return StrUtil.format(NOTIFY_FREQUENCY_LIMIT, templateId, userId, nonce);
    }


    public static String getSocialIsvEventLockKey(String tenantId, String appId) {
        Assert.notNull(tenantId, "tenant not null");
        Assert.notBlank(appId, "tenant app not null");
        return StrUtil.format(SOCIAL_ISV_EVENT_LOCK, tenantId, appId);
    }

    public static String getSocialIsvEventProcessingKey(String tenantId, String appId) {
        Assert.notNull(tenantId, "tenant not null");
        Assert.notBlank(appId, "tenant app not null");
        return StrUtil.format(SOCIAL_ISV_EVENT_PROCESSING, tenantId, appId);
    }
}
