package com.vikadata.boot.autoconfigure.pingpp;

import java.net.URL;
import java.nio.charset.StandardCharsets;

import cn.hutool.core.io.IoUtil;
import com.pingplusplus.Pingpp;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.ClassPathResource;

/**
 * ping++初始化
 * @author Shawn Deng
 * @date 2022-02-16 16:32:33
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
            throw new IllegalStateException("Ping++私钥文件未找到");
        }
        Pingpp.privateKey = IoUtil.read(url.openStream(), StandardCharsets.UTF_8);
    }
}
