package com.vikadata.api.security.afs;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.integration.afs.AfsChecker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.ActionException.ENABLE_SMS_VERIFICATION;
import static com.vikadata.api.enums.exception.ActionException.MAN_MACHINE_VERIFICATION_FAILED;
import static com.vikadata.api.enums.exception.ActionException.SECONDARY_VERIFICATION;

/**
 * <p>
 * 阿里云盾人机验证接口实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/2/6
 */
@Slf4j
@Service
public class AfsCheckServiceImpl implements AfsCheckService {

    @Autowired(required = false)
    private AfsChecker afsChecker;

    @Resource
    private ConstProperties constProperties;

    @Override
    public void noTraceCheck(String data) {
        if (afsChecker == null) {
            log.info("人机认证未开启");
            return;
        }
        if (StrUtil.isBlank(data)) {
            throw new BusinessException(MAN_MACHINE_VERIFICATION_FAILED);
        }
        else if (constProperties.getLoginToken() != null && constProperties.getLoginToken().contains(data)) {
            return;
        }
        // 根据需求填写
        String scoreJsonStr = "{\"200\":\"PASS\",\"400\":\"NC\",\"600\":\"NC\",\"700\":\"NC\",\"800\":\"BLOCK\"}";
        String result = afsChecker.noTraceCheck(data, scoreJsonStr);
        log.info("人机验证结果:{}", result);
        ExceptionUtil.isNotNull(result, SECONDARY_VERIFICATION);
        switch (result) {
            case "100":
            case "200":
                //直接通过
                break;
            case "400":
            case "600":
            case "700":
                //唤起滑块验证码
                throw new BusinessException(SECONDARY_VERIFICATION);
            case "800":
                //验证失败，直接拦截
                throw new BusinessException(MAN_MACHINE_VERIFICATION_FAILED);
            case "900":
                //滑块验证继续被风控识别为非法之后，启用短信验证码验证
                throw new BusinessException(ENABLE_SMS_VERIFICATION);
            default:
                break;
        }
    }
}
