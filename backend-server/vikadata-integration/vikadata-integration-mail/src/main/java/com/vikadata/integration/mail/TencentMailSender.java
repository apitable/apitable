package com.vikadata.integration.mail;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.ses.v20201002.models.SendEmailRequest;
import com.tencentcloudapi.ses.v20201002.models.Template;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * 腾讯云邮件推送
 * </p>
 *
 * @author Chambers
 * @date 2022/2/7
 */
public class TencentMailSender extends TencentSesClientAccessor implements CloudMailSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(TencentMailSender.class);

    public TencentMailSender(String region, String secretId, String secretKey, String from, String reply) {
        super(region, secretId, secretKey, from, reply);
    }

    @Override
    public void send(CloudEmailMessage message) {
        try {
            // 实例化一个请求对象,每个接口都会对应一个request对象
            SendEmailRequest req = new SendEmailRequest();

            req.setSubject(message.getSubject());
            req.setFromEmailAddress(StrUtil.format("{} <{}>", message.getPersonal(), super.from));
            req.setDestination(ArrayUtil.toArray(message.getTo(), String.class));
            req.setReplyToAddresses(super.reply);
            Template template = new Template();
            template.setTemplateID(message.getTemplateId());
            template.setTemplateData(message.getTemplateData());
            req.setTemplate(template);

            // 发送邮件
            this.getClient().SendEmail(req);
        }
        catch (TencentCloudSDKException e) {
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
