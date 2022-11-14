package com.vikadata.api.shared.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.shared.config.properties.SocketProperties.PREFIX;

/**
 * <p>
 * Socket properties
 * </p>
 *
 * @author Chambers
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class SocketProperties {

    public static final String PREFIX = "vikadata.socket";

    private String domain;

    private String token = "FutureIsComing";

    private String disableNodeShareNotify;

    private String fieldPermissionChangeNotify;

}
