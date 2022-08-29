package com.vikadata.api.config.properties;

import java.util.List;
import java.util.Map;

import cn.hutool.cache.Cache;
import cn.hutool.cache.CacheUtil;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 常量配置信息
 * </p>
 *
 * @author Chambers
 * @date 2020/1/2
 */
@Data
@ConfigurationProperties(prefix = "client")
public class ClientProperties {

    public static final String CLIENT_PROPERTY_DATA_ID = "client";

    public static final String CLIENT_FEATURE_ENV = "feature";

    public static final String CLIENT_PROPERTY_GROUP_ID = "ltd.vika";

    public static final String DATASHEET_HTML_CONTENT_CACHE_KEY = "DATASHEET_HTML_CONTENT_CACHE_KEY";

    public static final String HTML_TAG = "<!doctype html>";

    /**
     * 首页缓存，只缓存一个version的html,防止版本不统一
     */
    public static Cache<String, String> HTML_CONTENT_CACHE = CacheUtil.newFIFOCache(1);

    private Datasheet datasheet = new Datasheet();

    /**
     * <p>
     * 可以发版的授权用户
     * </p>
     *
     * @author zoe zheng
     * @date 2020/4/8 9:38 下午
     */
    @Data
    public static class Datasheet {

        /**
         * 可以发版的用户
         */
        private Publish publish;

        /**
         * 发送提醒
         */
        private Notify notify;

        /**
         * header.mete标签配置
         */
        private MetaLabel metaLabel;

        /**
         * datasheet的host
         */
        private String host = "https://integration.vika.ltd";

        private String env;

        /**
         * 灰度环境对应的不规则版本变量
         *
         * 举个栗子 teamx env = test
         */
        private Map<String, String> irregularEnv;

        private String pipeline = "";

        private Boolean I18nEnabled = false;
    }

    @Setter
    @Getter
    public static class Publish {
        private List<String> authUser;
    }

    @Setter
    @Getter
    public static class Notify {
        /**
         * 邮件接收方
         */
        private String emailTo = "zhengxu@vikadata.com";

        /**
         * 邮件发送方名称
         */
        private String senderName = "运维组";

        /**
         * 邮件发送title
         */
        private String title = "版本更新";
    }

    @Setter
    @Getter
    public static class MetaLabel {
        /**
         * 默认填充字段
         */
        private DefaultMetaContent defaultContent = null;

        /**
         * 分享链接失效文本
         */
        private DefaultMetaContent shareNotEnableContent = null;

        /**
         * 节点删除文本
         */
        private DefaultMetaContent nodeDeletedContent = null;

        /**
         * 模版删除文本
         */
        private DefaultMetaContent tplDeletedContent = null;

        /**
         * 通用og标签
         */
        private String commonLabel;

        /**
         * 默认og标签
         */
        private String defaultLabel;

        /**
         * 缓存时间，单位分钟
         */
        private Integer cacheExpire;
    }

    @Setter
    @Getter
    public static class DefaultMetaContent {
        private String description;

        private String title;

        private String image;
    }

}
