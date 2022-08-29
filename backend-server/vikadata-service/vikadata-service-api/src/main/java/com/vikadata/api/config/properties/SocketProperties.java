package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.SocketProperties.PREFIX;

/**
 * <p>
 * Socket Server 配置信息
 * </p>
 *
 * @author Chambers
 * @date 2021/3/3
 */

@Data
@ConfigurationProperties(prefix = PREFIX)
public class SocketProperties {

    public static final String PREFIX = "vikadata.socket";

    /**
     * 域名
     */
    private String domain;

    /**
     * 令牌
     */
    private String token = "FutureIsComing";

    /**
     * 关闭节点分享通知的请求地址
     */
    private String disableNodeShareNotify;

    /**
     * 字段权限变更通知的请求地址
     */
    private String fieldPermissionChangeNotify;

}
