package com.vikadata.api.config.properties;

import java.util.HashMap;
import java.util.Map;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.EmailSendProperties.PREFIX;

/**
 * <p>
 * email send properties
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class EmailSendProperties {

    public static final String PREFIX = "vikadata.email";

    /**
     * The running environment automatically resolves the domain name
     */
    private String context;

    /**
     * Signature of all messages
     */
    private String personal = "维格表";

    /**
     * Extended Attributes
     */
    private Map<String, String> properties = new HashMap<>(16);
}
