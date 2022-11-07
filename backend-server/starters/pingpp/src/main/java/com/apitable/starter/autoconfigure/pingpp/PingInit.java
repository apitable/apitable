package com.apitable.starter.autoconfigure.pingpp;

import java.net.URL;
import java.nio.charset.StandardCharsets;

import cn.hutool.core.io.IoUtil;
import com.pingplusplus.Pingpp;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.ClassPathResource;

/**
 * ping plus plus initial
 * @author Shawn Deng
 */
public class PingInit implements InitializingBean {

    private final PingProperties pingProperties;

    public PingInit(PingProperties pingProperties) {
        this.pingProperties = pingProperties;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Pingpp.apiKey = pingProperties.getApiKey();
        Pingpp.appId = pingProperties.getAppId();
        URL url = ClassPathResource.class.getClassLoader().getResource(pingProperties.getPrivateKeyPath());
        if (url == null) {
            throw new IllegalStateException("private key file not found");
        }
        Pingpp.privateKey = IoUtil.read(url.openStream(), StandardCharsets.UTF_8);
    }
}
