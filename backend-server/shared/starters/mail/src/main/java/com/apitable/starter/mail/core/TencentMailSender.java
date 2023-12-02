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

package com.apitable.starter.mail.core;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.ses.v20201002.models.SendEmailRequest;
import com.tencentcloudapi.ses.v20201002.models.Template;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Tencent cloud email push.
 * </p>
 */
public class TencentMailSender extends TencentSesClientAccessor implements CloudMailSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(TencentMailSender.class);

    public TencentMailSender(String region, String secretId, String secretKey, String from,
                             String reply) {
        super(region, secretId, secretKey, from, reply);
    }

    @Override
    public void send(CloudEmailMessage message) {
        try {
            // Instantiate a request object, and each interface will correspond to a request object
            SendEmailRequest req = new SendEmailRequest();

            req.setSubject(message.getSubject());
            req.setFromEmailAddress(StrUtil.format("{} <{}>", message.getPersonal(), super.from));
            req.setDestination(ArrayUtil.toArray(message.getTo(), String.class));
            req.setReplyToAddresses(super.reply);
            Template template = new Template();
            template.setTemplateID(message.getTemplateId());
            template.setTemplateData(message.getTemplateData());
            req.setTemplate(template);

            // send email
            this.getClient().SendEmail(req);
        } catch (TencentCloudSDKException e) {
            String ignoreInfo = "EmailAddressIsNULL";
            if (e.getErrorCode().contains(ignoreInfo)) {
                return;
            } else if ("FailedOperation.FrequencyLimit".equals(e.getErrorCode())) {
                LOGGER.warn(e.toString());
                return;
            }
            LOGGER.error(e.toString());
        }
    }
}
