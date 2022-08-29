package com.vikadata.api.config.properties;

import java.util.HashMap;
import java.util.Map;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.EmailSendProperties.PREFIX;

/**
 * <p>
 * 邮件发送定制化配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/11 16:43
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class EmailSendProperties {

    public static final String PREFIX = "vikadata.email";

    /**
     * 运行环境，自动解析域名
     */
    private String context;

    /**
     * 所有邮件的签名
     */
    private String personal = "维格表";

    /**
     * 扩展属性
     */
    private Map<String, String> properties = new HashMap<>(16);
}
