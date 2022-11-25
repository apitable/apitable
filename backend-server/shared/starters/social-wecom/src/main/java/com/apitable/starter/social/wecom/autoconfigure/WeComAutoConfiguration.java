package com.apitable.starter.social.wecom.autoconfigure;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.collection.CollUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.chanjar.weixin.common.redis.RedisTemplateWxRedisOps;
import me.chanjar.weixin.common.redis.WxRedisOps;
import me.chanjar.weixin.cp.api.WxCpService;

import com.apitable.starter.social.wecom.autoconfigure.WeComProperties.ConfigStorage;
import com.vikadata.social.wecom.WeComConfig;
import com.vikadata.social.wecom.WeComConfig.InitMenu;
import com.vikadata.social.wecom.WeComConfig.IsvApp;
import com.vikadata.social.wecom.WeComConfig.OperateEnpDdns;
import com.vikadata.social.wecom.WeComTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * <p>
 * autoconfiguration of wecom
 * </p>
 * @author Pengap
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(WeComProperties.class)
@ConditionalOnClass(WxCpService.class)
@ConditionalOnProperty(value = "vikadata-starter.social.wecom.enabled", havingValue = "true")
public class WeComAutoConfiguration {

    private final WeComProperties wxMaProperties;

    public WeComAutoConfiguration(WeComProperties wxMaProperties) {
        this.wxMaProperties = wxMaProperties;
    }

    @Bean
    @ConditionalOnMissingBean
    public WeComTemplate weComTemplate(ApplicationContext applicationContext) {
        ConfigStorage configStorage = wxMaProperties.getConfigStorage();
        List<InitMenu> initMenus = null;
        try {
            if (CollUtil.isNotEmpty(wxMaProperties.getInitMenus())) {
                ObjectMapper objectMapper = new ObjectMapper();
                String initMenusJson = objectMapper.writeValueAsString(wxMaProperties.getInitMenus());
                initMenus = objectMapper.readValue(initMenusJson, new TypeReference<List<InitMenu>>() {});
            }
        }
        catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        OperateEnpDdns operateEnpDdns = new OperateEnpDdns();
        BeanUtil.copyProperties(wxMaProperties.getOperateEnpDdns(), operateEnpDdns, CopyOptions.create().ignoreError());

        WeComConfig config = new WeComConfig(configStorage.getStorageType().name(), configStorage.getKeyPrefix());
        config.setVikaWeComAppId(wxMaProperties.getVikaWeComAppId());
        config.setInitMenus(initMenus);
        config.setOperateEnpDdns(operateEnpDdns);
        config.setIsvAppList(Optional.ofNullable(wxMaProperties.getIsvAppList())
                .map(list -> list.stream()
                        .map(item -> {
                            IsvApp isvApp = new IsvApp();
                            BeanUtil.copyProperties(item, isvApp);

                            return isvApp;
                        }).collect(Collectors.toList()))
                .orElse(null));
        WxRedisOps wxRedisOps = new RedisTemplateWxRedisOps(applicationContext.getBean(StringRedisTemplate.class));
        return new WeComTemplate(config, wxRedisOps);
    }
}
