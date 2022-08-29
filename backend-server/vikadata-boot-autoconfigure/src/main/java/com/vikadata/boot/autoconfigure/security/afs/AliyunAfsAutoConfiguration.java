package com.vikadata.boot.autoconfigure.security.afs;

import com.aliyuncs.afs.model.v20180112.AnalyzeNvcRequest;
import com.aliyuncs.afs.model.v20180112.AnalyzeNvcResponse;
import com.vikadata.integration.afs.AfsChecker;
import com.vikadata.integration.afs.AliyunAfsChecker;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;


/**
 * <p>
 * 阿里云盾人机验证服务配置
 * </p>
 *
 * @author Chambers
 * @date 2020/3/2
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
        Assert.state(aliyun != null, "云盾人机验证尚未配置");
        return new AliyunAfsChecker(aliyun.getRegionId(), aliyun.getAccessKeyId(), aliyun.getSecret());
    }
}
