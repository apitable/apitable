package com.vikadata.scheduler.space.handler;

import java.util.Objects;

import javax.annotation.Resource;

import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.scheduler.space.config.properties.InternalProperties;
import com.vikadata.scheduler.space.model.ResponseDataDto;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * <p>
 * 企微服务商接口许可延时任务
 * </p>
 * @author 刘斌华
 * @date 2022-08-10 16:33:31
 */
@Component
public class WeComPermitDelayJobHandler {

    @Resource
    private InternalProperties internalProperties;

    @Resource
    private RestTemplate restTemplate;

    @XxlJob(value = "callSocialWecomPermitDelayBatchProcess")
    public void callSocialWecomPermitDelayBatchProcess() {
        String url = internalProperties.getDomain() + internalProperties.getBatchProcessSocialWecomPermitDelayUrl();
        ResponseDataDto<?> response = restTemplate.postForObject(url, null, ResponseDataDto.class);
        if (Objects.isNull(response) || Boolean.FALSE.equals(response.getSuccess())) {
            XxlJobHelper.log("调用批量处理企微接口许可延时接口失败");
        }
    }

}
