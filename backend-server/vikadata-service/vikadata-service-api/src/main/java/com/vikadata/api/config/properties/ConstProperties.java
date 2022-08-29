package com.vikadata.api.config.properties;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.ConstProperties.PREFIX_CONST;

/**
 * <p>
 * 常量配置信息
 * </p>
 *
 * @author Chambers
 * @date 2020/1/2
 */
@Data
@ConfigurationProperties(prefix = PREFIX_CONST)
public class ConstProperties {

    public static final String PREFIX_CONST = "vikadata.const";

    private String languageTag = "zh-CN";

    private String serverDomain;

    /**
     * 各个环境的回调域名
     */
    private String callbackDomain;

    private String workbenchUrl = "/workbench";

    /**
     * oss存储桶配置
     */
    private Map<BucketKey, OssBucketInfo> ossBuckets;

    /**
     * 文档登陆避开人机验证token
     */
    private String loginToken = "BornForFuture";

    /**
     * 官方默认头像列表
     */
    private String defaultAvatarList;

    /**
     * 用户白名单列表，不设空间数量上限
     */
    private String userWhiteList = "";

    /**
     * 模板空间，该空间创建的模版将成为官方模版，且不设模版数量上限
     */
    private String templateSpace = "";

    /**
     * 新空间默认引用的模板ID
     */
    private String quoteTemplateId = "tpll8mltwrZMT";

    /**
     * 新空间默认引用的英文模板ID
     */
    private String quoteEnTemplateId = "tpll8mltwrZMT";

    /**
     * GM 配置组织单元
     */
    private Long gmConfigUnit;

    private String integralRewardConfig = "https://integration.vika.ltd,usk8qo1Dk9PbecBlaqFIvbb,dst9qAYY0ud1E3Av4f,viwPFbZIozOUs";

    /**
     * 微信公众号 获取邀请码的关键词
     */
    private String inviteCodeKeyword;

    /**
     * 微信公众号 获取邀请码的消息体
     */
    private String inviteCodeMessage;

    /**
     * 微信公众号 获取邀请码活动的截止时间
     */
    private String inviteCodeExpireTime;

    /**
     * 微信公众号 获取邀请码活动截止后的回复
     */
    private String inviteCodeExpireReply;

    /**
     * VCode 长度
     */
    private Integer vCodeLength = 8;

    /**
     * 微信扫码登录/绑定 回复的模板消息ID
     */
    private String qrCodeReplyId;

    /**
     * 微信扫码登录/绑定 回复的模板消息的开头
     */
    private String qrCodeReplyFirst = "扫码成功";

    /**
     * 微信扫码登录/绑定 回复的模板消息的开头
     */
    private String qrCodeReplyMethod = "微信扫码";

    /**
     * 微信扫码登录/绑定 回复的模板消息的结尾
     */
    private String qrCodeReplyEnd = "更多操作请前往WEB端（vika.cn）进行。";

    /**
     * 邀请成员通知线程等待时间ms
     */
    private Integer inviteNotifyWaitTime = 3000;

    /**
     * 成员提及次数统计redis超时时间ms
     */
    private Integer mentionNotifyWaitTime = 15000;

    /**
     * 测试手机号前缀
     */
    private String testMobilePre = "1340000";

    /**
     * 钉钉订阅信息维格表ID
     */
    private String dingTalkOrderDatasheet;

    /**
     * 钉钉应用vika页面的显示设置ID
     */
    private String vikaDingTalkAppId = "ina9134969049653777";

    /**
     * 灰度功能"新后端"的 space 白名单
     */
    private String newBackendSpaceIds = "";

    /**
     * 发送订阅相关通知
     */
    private Boolean sendSubscriptionNotify = true;

    /**
     * 钉钉自建应用是否需要还原目录树
     */
    private Boolean dingTalkContactWithTree = false;

    /**
     * 空间站基础认证赠送的附件容量 GB
     */
    private Integer spaceBasicCertificationCapacity = 5;

    /**
     * 空间站高级认证赠送的空间站容量 GB
     */
    private Integer spaceSeniorCertificationCapacity = 10;

    public OssBucketInfo getOssBucketByAsset() {
        return Optional.ofNullable(ossBuckets).orElseGet(HashMap::new).getOrDefault(BucketKey.VK_ASSETS_LTD, new OssBucketInfo());
    }

    public OssBucketInfo getOssBucketByPublicAsset() {
        return Optional.ofNullable(ossBuckets).orElseGet(HashMap::new).getOrDefault(BucketKey.VK_PUBLIC_ASSETS_LTD, new OssBucketInfo());
    }

    // 存储桶定义
    public enum BucketKey {
        // 旧资源桶
        // 改造前端直传期间暂时保留，等改造完成在作废
        @Deprecated
        VK_ASSETS_LTD,
        // 新的公开桶
        VK_PUBLIC_ASSETS_LTD,
    }

    @Data
    public static class OssBucketInfo {
        /**
         * 存储桶域名
         */
        private String resourceUrl = "";

        /**
         * 存储桶名称
         */
        private String bucketName;

        /**
         * 存储类型
         *
         * 对应 vika settings （QNY1...）
         */
        private String type;
    }

    /* Gray Config Start */
    // 灰度空间站替换「serverDomain」变量
    private String grayServerDomain;

    // 灰度空间站替换「callbackDomain」变量
    private String grayCallbackDomain;
    /* Gray Config End */

}
