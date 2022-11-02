package com.vikadata.api.config.properties;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.SecurityProperties.PREFIX;

/**
 * <p>
 * security properties
 * </p>
 *
 * @author Chambers
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
         * digit of numbers
         */
        private int digit;

        /**
         * Valid time of verification code，unit：minutes
         */
        private int effectiveTime;

        /**
         * Valid time for successful verification of verification code，unit：minutes
         */
        private int successTime;

        /**
         * Locking time exceeding the upper limit，unit：minutes
         */
        private int lockTime;

        /**
         * The maximum number of times to continuously obtain or verify the verification code error
         */
        private int maxErrorNum;

        /**
         * The maximum number of times a phone number can be sent in a day
         */
        private int maxSendCount;

        /**
         * The maximum number of times to send the same IP in one day
         */
        private int maxIpSendCount;

        /**
         * The maximum number of times an application sends in a day
         */
        private int maxDaySendCount;
    }

    @Setter
    @Getter
    public static class Email {

        /**
         * Digits of verification code
         */
        private int digit;

        /**
         * Valid time of verification code，unit：minutes
         */
        private int effectiveTime;

        /**
         * Locking time exceeding the upper limit，unit：minutes
         */
        private int lockTime;

        /**
         * The maximum number of times to continuously obtain or verify the verification code error
         */
        private int maxErrorNum;

        /**
         * The maximum number of times a phone number can be sent in a day
         */
        private int maxSendCount;

        /**
         * The maximum number of times to send the same IP in one day
         */
        private int maxIpSendCount;
    }
}
