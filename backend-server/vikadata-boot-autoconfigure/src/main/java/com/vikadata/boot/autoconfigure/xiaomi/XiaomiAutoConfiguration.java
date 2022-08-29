package com.vikadata.boot.autoconfigure.xiaomi;

import com.xiaomi.aegis.config.AegisConfig;
import com.xiaomi.aegis.utils.CommonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.boot.autoconfigure.web.servlet.ConditionalOnMissingFilterBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.xiaomi.aegis.constant.SdkConstants.LOG_PROJECT_NAME;

/**
 * 小米 cas授权接入
 * @author Shawn Deng
 * @date 2021-06-30 15:08:13
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(XiaomiProperties.class)
@ConditionalOnClass(AegisConfig.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnProperty(value = "vikadata-starter.xiaomi.enabled", havingValue = "true")
public class XiaomiAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(XiaomiAutoConfiguration.class);

    @Bean
    @ConditionalOnMissingBean
    public UnauthorizedResponseCustomizer unauthorizedResponseCustomizer() {
        return new DefaultUnauthorizedResponseCustomizer();
    }

    @Bean
    @ConditionalOnMissingFilterBean(CasMidunFilter.class)
    public CasMidunFilter casMidunFilter(XiaomiProperties xiaomiProperties, ObjectProvider<UnauthorizedResponseCustomizer> customizers) {
        customizerAegis(xiaomiProperties);
        return new CasMidunFilter(customizers.getIfAvailable());
    }

    private void customizerAegis(XiaomiProperties properties) {
        if (CommonUtil.isEmpty(AegisConfig.AEGIS_SDK_PUBLIC_KEY)) {
            if (CommonUtil.isNotEmpty(properties.getPublicKey())) {
                AegisConfig.setPublicKey(properties.getPublicKey());
            }
        }
        if (CommonUtil.isEmpty(AegisConfig.AEGIS_SDK_PUBLIC_KEY)) {
            throw new IllegalStateException(LOG_PROJECT_NAME + "AegisConfig.AEGIS_SDK_PUBLIC_KEY must config");
        }
        AegisConfig.setPublicKeys(AegisConfig.AEGIS_SDK_PUBLIC_KEY.split("[,|，]"));

        if (CommonUtil.isEmpty(AegisConfig.IGNORE_URL)) {
            if (CommonUtil.isNotEmpty(properties.getIgnoreUrls())) {
                AegisConfig.setIgnoreUrl(properties.getIgnoreUrls().stream().reduce("", (pre, cur) -> pre.concat(",").concat(cur)));
            }
        }
        if (CommonUtil.isNotEmpty(AegisConfig.IGNORE_URL)) {
            AegisConfig.setIgnoreUrlArr(AegisConfig.IGNORE_URL.split("[,|，]"));
            LOGGER.info("已设置忽略路径，ignoreUrls:{}", AegisConfig.IGNORE_URL);
        }

        LOGGER.info("AegisFilter init finish,{} public key", AegisConfig.publicKeys.length);
    }

//    public FilterRegistrationBean<CasMidunFilter> casMidunFilterFilterRegistrationBean() {
//        FilterRegistrationBean<CasMidunFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new CasMidunFilter());
//        registrationBean.addUrlPatterns("/*");
//        if (xiaomiProperties.getIgnoreUrls() != null) {
//            registrationBean.addInitParameter(IGNORE_URL_FILTER_INIT_PARAM_KEY, xiaomiProperties.getIgnoreUrls().stream().reduce("", (pre, cur) -> pre.concat(",").concat(cur)));
//        }
//        if (xiaomiProperties.getPublicKey() == null || "".equals(xiaomiProperties.getPublicKey())) {
//            LOGGER.error("小米 Public Key 不能为空");
//            throw new IllegalStateException("小米 Public Key 不能为空");
//        }
//        registrationBean.addInitParameter(PUBLIC_KEY_FILTER_INIT_PARAM_KEY, xiaomiProperties.getPublicKey());
//        return registrationBean;
//    }
}
