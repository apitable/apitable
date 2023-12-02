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
import com.yunpian.sdk.YunpianClient;
import com.yunpian.sdk.model.Result;
import com.yunpian.sdk.model.SmsSingleSend;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Cloud chip SMS implementation class.
 * </p>
 *
 */
public class YunpianSmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(YunpianSmsSender.class);

    private final String apikey;

    public YunpianSmsSender(String apikey) {
        this.apikey = apikey;
    }

    @Override
    public void send(SmsMessage smsMessage) {
        log.info("Send SMS, mobile: {} - {}", smsMessage.getAreaCode(), smsMessage.getMobile());
        // Initialize client singleton mode
        YunpianClient client = new YunpianClient(apikey).init();

        // send message API
        Map<String, String> param = client.newParam(2);
        param.put(YunpianClient.MOBILE, smsMessage.getAreaCode() + smsMessage.getMobile());
        param.put(YunpianClient.TEXT, smsMessage.getText());
        Result<SmsSingleSend> result = client.sms().single_send(param);
        if (result.getCode() != 0) {
            log.error("Failed to send international SMS, number:{}, code:{}，error message:{}", smsMessage.getMobile(), result.getCode(), result.getMsg());
            throw new RuntimeException(StrUtil.format("Failed to send cloud chip SMS, code:{}, error message:{}「{}」", result.getCode(), result.getMsg(), result.getThrowable()));
        }
    }
}
