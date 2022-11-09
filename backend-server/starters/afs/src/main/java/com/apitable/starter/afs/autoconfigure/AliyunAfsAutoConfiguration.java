package com.apitable.starter.afs.autoconfigure;

import com.aliyuncs.afs.model.v20180112.AnalyzeNvcRequest;
import com.aliyuncs.afs.model.v20180112.AnalyzeNvcResponse;
import com.apitable.starter.afs.core.AfsChecker;
import com.apitable.starter.afs.core.AliyunAfsChecker;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;


/**
 * <p>
 * Alibaba Cloud Human-Machine Authentication Service Configuration
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({AnalyzeNvcRequest.class, AnalyzeNvcResponse.class})
public class AliyunAfsAutoConfiguration {

    private final AfsProperties properties;

    public AliyunAfsAutoConfiguration(AfsProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(AfsChecker.class)
    public AfsChecker afsChecker() {
        AfsProperties.Aliyun aliyun = properties.getAliyun();
        Assert.state(aliyun != null, "human-machine verification has not been configured");
        return new AliyunAfsChecker(aliyun.getRegionId(), aliyun.getAccessKeyId(), aliyun.getSecret());
    }
}
