/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.starter.sms.core;

import cn.hutool.core.util.StrUtil;
import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import com.github.qcloudsms.httpclient.HTTPException;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Tencent Cloud SMS Sender.
 * </p>
 */
public class TencentSmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(TencentSmsSender.class);

    private final Integer appId;

    private final String appKey;

    private final String sign;

    /**
     * constructor.
     *
     * @param appId  SMS application ID
     * @param appKey SMS application key
     * @param sign   SMS signature
     */
    public TencentSmsSender(Integer appId, String appKey, String sign) {
        this.appId = appId;
        this.appKey = appKey;
        this.sign = sign;
    }

    @Override
    public void send(SmsMessage smsMessage) {
        log.info("Send SMS");
        //TODO Under high performance, the message is published by MQ queue and sent to the subscriber for consumption.
        // Here, the message is sent by single thread temporarily
        try {
            String smsTemplateCode = smsMessage.getTemplateCode();
            SmsSingleSender sender = new SmsSingleSender(appId, appKey);
            SmsSingleSenderResult result = sender.sendWithParam(
                StrUtil.strip(smsMessage.getAreaCode(), "+"),
                smsMessage.getMobile(), Integer.parseInt(smsTemplateCode),
                smsMessage.getParams(), sign,
                "", "");
            if (result.result != 0) {
                log.error("fail in send, code:{}, error message:{}", result.result, result.errMsg);
                throw new RuntimeException(
                    StrUtil.format("fail in send, code:{}, error message:{}", result.result,
                        result.errMsg));
            }
        } catch (HTTPException e) {
            // HTTP response code error
            log.error("Failed to connect to SMS server,code:{}, msg{}", e.getStatusCode(),
                e.getMessage());
            throw new RuntimeException(
                StrUtil.format("Failed to connect to SMS server,code:{}, msg{}", e.getStatusCode(),
                    e.getMessage()));
        } catch (IOException e) {
            // Network IO error
            log.error("Error connecting to SMS network, msg{}", e.getMessage());
            throw new RuntimeException(
                StrUtil.format("Error connecting to SMS network, msg{}", e.getMessage()));
        } catch (Exception e) {
            // other errors
            log.error("The SMS server failed to parse the returned information, msg{}",
                e.getMessage());
            throw new RuntimeException(
                StrUtil.format("The SMS server failed to parse the returned information, msg{}",
                    e.getMessage()));
        }
    }
}
