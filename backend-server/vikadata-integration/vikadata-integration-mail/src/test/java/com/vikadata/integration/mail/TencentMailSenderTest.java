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
            // Instantiate an authentication object. To enter the parameter, you need to pass in the secretId and secretKey of Tencent's cloud account.
            // Here, you also need to pay attention to the confidentiality of the key pair
            // Key can go to https://console.cloud.tencent.com/cam/capi Website
            Credential cred = new Credential("AKIDua7RYR5WihT1KQIuHPIvJRKyOaXHoFcp", "3rRlqgHemfLo58wuqfIgplTvAAvQghU2");
            // Instantiate an http option. Optional. No special requirements can be skipped
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("ses.tencentcloudapi.com");
            // Instantiate a client option. Optional. No special requirements can be skipped
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);
            // Instantiate the client object of the requested product. The clientProfile is optional
            SesClient client = new SesClient(cred, "ap-hongkong", clientProfile);
            // Instantiate a request object, and each interface will correspond to a request object
            SendEmailRequest req = new SendEmailRequest();

            req.setFromEmailAddress("维格表 <email-server@vikadata.com>");
            req.setDestination(new String[]{"chenbochao@vikadata.com"});
            req.setSubject("邮件验证码");
            Template template = new Template();
            template.setTemplateID(23440L);
            template.setTemplateData("{\"VERIFICATION_CODE\":\"123456\",\"YEARS\":\"2022\"}");
            req.setTemplate(template);


            // The returned resp is an instance of SendEmailResponse, corresponding to the request object
            SendEmailResponse resp = client.SendEmail(req);
            // Output the json format string package
            System.out.println(BatchSendEmailResponse.toJsonString(resp));
        } catch (TencentCloudSDKException e) {
            System.out.println(e);
        }
    }
}
