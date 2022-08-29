package com.vikadata.api.config.properties;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.SecurityProperties.PREFIX;

/**
 * <p>
 * 安全机制配置
 * </p>
 *
 * @author Chambers
 * @date 2020/1/9
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class SecurityProperties {

    public static final String PREFIX = "vikadata.security";

    private Sms sms;

    private Email email;

    @Setter
    @Getter
    public static class Sms {

        /**
         * 验证码的位数
         */
        private int digit;

        /**
         * 验证码的有效时间，单位：分钟
         */
        private int effectiveTime;

        /**
         * 验证码校验成功的有效时间，单位：分钟
         */
        private int successTime;

        /**
         * 超过上限的锁定时间，单位：分钟
         */
        private int lockTime;

        /**
         * 连续获取验证码或校验验证码错误的最大次数
         */
        private int maxErrorNum;

        /**
         * 同个手机号一天的最大发送次数
         */
        private int maxSendCount;

        /**
         * 同个IP一天的最大发送次数
         */
        private int maxIpSendCount;

        /**
         * 应用一天的最大发送次数
         */
        private int maxDaySendCount;
    }

    @Setter
    @Getter
    public static class Email {

        /**
         * 验证码的位数
         */
        private int digit;

        /**
         * 验证码的有效时间，单位：分钟
         */
        private int effectiveTime;

        /**
         * 超过上限的锁定时间，单位：分钟
         */
        private int lockTime;

        /**
         * 连续获取验证码或校验验证码错误的最大次数
         */
        private int maxErrorNum;

        /**
         * 同个手机号一天的最大发送次数
         */
        private int maxSendCount;

        /**
         * 同个IP一天的最大发送次数
         */
        private int maxIpSendCount;
    }
}
