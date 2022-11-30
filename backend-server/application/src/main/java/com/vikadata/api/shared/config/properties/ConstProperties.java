package com.vikadata.api.shared.config.properties;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.shared.config.properties.ConstProperties.PREFIX_CONST;

/**
 * <p>
 * server constants properties
 * </p>
 *
 * @author Chambers
 */
@Data
@ConfigurationProperties(prefix = PREFIX_CONST)
public class ConstProperties {

    public static final String PREFIX_CONST = "vikadata.const";

    private String languageTag = "zh-CN";

    private String serverDomain;

    private String callbackDomain;

    private String workbenchUrl = "/workbench";

    /**
     * Whether to create a picture audit record
     */
    private boolean ossImageAuditCreatable = false;

    /**
     * OSS bucket configuration
     */
    private Map<BucketKey, OssBucketInfo> ossBuckets;

    /**
     * api document avoid validate token
     */
    private String loginToken = "BornForFuture";

    /**
     * Official default avatar list
     * @deprecated open-source
     */
    @Deprecated
    private String defaultAvatarList;

    /**
     * User white list, no upper limit of space
     */
    private String userWhiteList = "";

    /**
     * Template space, the templates created in this space will become official templates,
     * and there is no upper limit for the number of templates
     */
    private String templateSpace = "";

    /**
     * Template ID referenced by new space by default
     */
    private String quoteTemplateId = "tpll8mltwrZMT";

    /**
     * English template ID referenced by default in new space
     */
    private String quoteEnTemplateId = "tpll8mltwrZMT";

    /**
     * @deprecated open-source
     */
    @Deprecated
    private Long gmConfigUnit;

    private String integralRewardConfig = "https://integration.vika.ltd,usk8qo1Dk9PbecBlaqFIvbb,dst9qAYY0ud1E3Av4f,viwPFbZIozOUs";

    /**
     * wechat-mp invite code keyword
     * @deprecated open-source
     */
    @Deprecated
    private String inviteCodeKeyword;

    /**
     * wechat-mp get invite code message body
     * @deprecated open-source
     */
    private String inviteCodeMessage;

    /**
     * wechat-mp deadline of invitation code
     * @deprecated open-source
     */
    @Deprecated
    private String inviteCodeExpireTime;

    /**
     * wechat-mp for replying after get invitation code
     * @deprecated open-source
     */
    @Deprecated
    private String inviteCodeExpireReply;

    /**
     * v-code length
     */
    @Deprecated
    private Integer vCodeLength = 8;

    /**
     * wechat-mp reply template id
     * @deprecated open-source
     */
    @Deprecated
    private String qrCodeReplyId;

    /**
     * The beginning of the template message for the reply
     * warning: do not translate value
     * @deprecated open-source
     */
    @Deprecated
    private String qrCodeReplyFirst = "扫码成功";

    /**
     * The beginning of the template message for the reply
     * warning: do not translate value
     * @deprecated open-source
     */
    @Deprecated
    private String qrCodeReplyMethod = "微信扫码";

    /**
     * the end of the template message for the reply
     */
    @Deprecated
    private String qrCodeReplyEnd = "更多操作请前往WEB端（vika.cn）进行。";

    /**
     * invite member notification thread wait time ms
     */
    @Deprecated
    private Integer inviteNotifyWaitTime = 3000;

    /**
     * member mention count statistics redis timeout ms
     * @deprecated open-source
     */
    @Deprecated
    private Integer mentionNotifyWaitTime = 15000;

    /**
     * test phone number prefix
     */
    @Deprecated
    private String testMobilePre = "1340000";

    /**
     * dingtalk subscription information table id
     */
    private String dingTalkOrderDatasheet;

    /**
     * display setting id of dingtalk app page
     */
    private String vikaDingTalkAppId = "ina9134969049653777";

    /**
     * space whitelist for grayscale function "new backend"
     */
    private String newBackendSpaceIds = "";

    /**
     * send subscription related notifications
     */
    private Boolean sendSubscriptionNotify = true;

    /**
     * Do DingTalk self-built apps need to restore the directory tree?
     */
    private Boolean dingTalkContactWithTree = false;

    /**
     * The capacity of accessories given by the basic certification of the space station GB
     */
    private Integer spaceBasicCertificationCapacity = 5;

    /**
     * Space station capacity gifted with space station advanced certification GB
     */
    private Integer spaceSeniorCertificationCapacity = 10;

    private StorageType storageType;

    public OssBucketInfo getOssBucketByAsset() {
        return Optional.ofNullable(ossBuckets).orElseGet(HashMap::new).getOrDefault(BucketKey.VK_ASSETS_LTD, new OssBucketInfo());
    }

    public OssBucketInfo getOssBucketByPublicAsset() {
        return Optional.ofNullable(ossBuckets).orElseGet(HashMap::new).getOrDefault(BucketKey.VK_PUBLIC_ASSETS_LTD, new OssBucketInfo());
    }

    public enum BucketKey {
        // old resource bucket
        // It will be temporarily reserved during the transformation of the front-end direct transmission, and will be invalid when the transformation is completed.
        @Deprecated
        VK_ASSETS_LTD,
        // new open bucket
        VK_PUBLIC_ASSETS_LTD,
    }

    public enum StorageType {
        MYSQL, MONGO, Redis
    }

    @Data
    public static class OssBucketInfo {

        private String resourceUrl = "";

        private String bucketName;

        private String type;
    }

    /* Gray Config Start */
    private String grayServerDomain;

    private String grayCallbackDomain;
    /* Gray Config End */


    public String defaultServerDomain() {
        return ReUtil.replaceAll(serverDomain, "http://|https://", StrUtil.EMPTY);
    }
}
