package com.vikadata.boot.autoconfigure.social.wecom;

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

import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties.ConfigStorage;
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
 * 企业微信配置文件自动装配
 * </p>
 * @author Pengap
 * @date 2021/7/26 15:23:16
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

    /*
     * 这里不做自动装配的实现，主要原因如下
     * 1.初始情况下没有可用的企业微信Config
     * 2.存在配置文件，由于启动需要读取数据库，造成启动APP缓慢
     * 3.运行过程中空间站绑定企业微信
     */

}
