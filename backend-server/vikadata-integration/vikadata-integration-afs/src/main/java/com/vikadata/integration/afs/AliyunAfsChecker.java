package com.vikadata.integration.afs;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.afs.model.v20180112.AnalyzeNvcRequest;
import com.aliyuncs.afs.model.v20180112.AnalyzeNvcResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * 阿里云盾人机验证接口实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/2/6
 */
public class AliyunAfsChecker implements AfsChecker {

    private static final Logger LOGGER = LoggerFactory.getLogger(AliyunAfsChecker.class);

    private final String regionId;

    private final String accessKeyId;

    private final String secret;

    public AliyunAfsChecker(String regionId, String accessKeyId, String secret) {
        this.regionId = regionId;
        this.accessKeyId = accessKeyId;
        this.secret = secret;
    }

    @Override
    public String noTraceCheck(String data, String scoreJsonStr) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("云盾人机-无痕验证");
        }
        AnalyzeNvcRequest request = new AnalyzeNvcRequest();
        // 必填参数，前端获取getNVCVal函数的值
        request.setData(data);
        // 根据需求填写
        request.setScoreJsonStr(scoreJsonStr);
        try {
            AnalyzeNvcResponse response = getClient().getAcsResponse(request);
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("人机验证结果: {}", response.getBizCode());
            }
            return response.getBizCode();
        } catch (ClientException e) {
            e.printStackTrace();
        }
        return null;
    }

    private IAcsClient getClient() {
        IClientProfile profile = DefaultProfile.getProfile(regionId, accessKeyId, secret);
        IAcsClient client = new DefaultAcsClient(profile);
        DefaultProfile.addEndpoint(regionId, "afs", "afs.aliyuncs.com");
        return client;
    }
}
