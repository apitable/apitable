package com.vikadata.api.shared.config.properties;

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
 * client properties
 * </p>
 *
 * @author Chambers
 */
@Deprecated
@Data
@ConfigurationProperties(prefix = "client")
public class ClientProperties {

    public static final String CLIENT_PROPERTY_DATA_ID = "client";

    public static final String CLIENT_FEATURE_ENV = "feature";

    public static final String CLIENT_PROPERTY_GROUP_ID = "ltd.vika";

    public static final String DATASHEET_HTML_CONTENT_CACHE_KEY = "DATASHEET_HTML_CONTENT_CACHE_KEY";

    public static final String HTML_TAG = "<!doctype html>";

    public static Cache<String, String> HTML_CONTENT_CACHE = CacheUtil.newFIFOCache(1);

    private Datasheet datasheet = new Datasheet();

    @Data
    public static class Datasheet {

        private Publish publish;

        private Notify notify;

        private MetaLabel metaLabel;

        private String host = "https://integration.vika.ltd";

        private String env;

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

        private String emailTo = "zhengxu@vikadata.com";

        private String senderName = "Devops";

        private String title = "Release Update";
    }

    @Setter
    @Getter
    public static class MetaLabel {

        private DefaultMetaContent defaultContent = null;

        private DefaultMetaContent shareNotEnableContent = null;

        private DefaultMetaContent nodeDeletedContent = null;

        private DefaultMetaContent tplDeletedContent = null;

        private String commonLabel;

        private String defaultLabel;

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
