package com.vikadata.integration.mail;


import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.ses.v20201002.SesClient;
import com.tencentcloudapi.ses.v20201002.models.BatchSendEmailResponse;
import com.tencentcloudapi.ses.v20201002.models.SendEmailRequest;
import com.tencentcloudapi.ses.v20201002.models.SendEmailResponse;
import com.tencentcloudapi.ses.v20201002.models.Template;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

@Disabled("no assertion")
public class TencentMailSenderTest {

    @Test
    public void send() {
        try{
            // 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey,此处还需注意密钥对的保密
            // 密钥可前往https://console.cloud.tencent.com/cam/capi网站进行获取
            Credential cred = new Credential("AKIDua7RYR5WihT1KQIuHPIvJRKyOaXHoFcp", "3rRlqgHemfLo58wuqfIgplTvAAvQghU2");
            // 实例化一个http选项，可选的，没有特殊需求可以跳过
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("ses.tencentcloudapi.com");
            // 实例化一个client选项，可选的，没有特殊需求可以跳过
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);
            // 实例化要请求产品的client对象,clientProfile是可选的
            SesClient client = new SesClient(cred, "ap-hongkong", clientProfile);
            // 实例化一个请求对象,每个接口都会对应一个request对象
            SendEmailRequest req = new SendEmailRequest();

            req.setFromEmailAddress("维格表 <email-server@vikadata.com>");
            req.setDestination(new String[]{"chenbochao@vikadata.com"});
            req.setSubject("邮件验证码");
            Template template = new Template();
            template.setTemplateID(23440L);
            template.setTemplateData("{\"VERIFICATION_CODE\":\"123456\",\"YEARS\":\"2022\"}");
            req.setTemplate(template);


            // 返回的resp是一个SendEmailResponse的实例，与请求对象对应
            SendEmailResponse resp = client.SendEmail(req);
            // 输出json格式的字符串回包
            System.out.println(BatchSendEmailResponse.toJsonString(resp));
        } catch (TencentCloudSDKException e) {
            System.out.println(e);
        }
    }
}
