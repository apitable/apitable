package com.vikadata.api.enterprise.common.afs;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.afs.core.AfsChecker;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.vikadata.api.base.enums.ActionException.ENABLE_SMS_VERIFICATION;
import static com.vikadata.api.base.enums.ActionException.MAN_MACHINE_VERIFICATION_FAILED;
import static com.vikadata.api.base.enums.ActionException.SECONDARY_VERIFICATION;

/**
 * <p>
 * Alibaba Cloud Shield Human-Machine Verification Interface Implementation Class
 * </p>
 *
 * @author Chambers
 */
@Slf4j
@Service
public class AfsCheckServiceImpl implements AfsCheckService {

    @Autowired(required = false)
    private AfsChecker afsChecker;

    @Resource
    private ConstProperties constProperties;

    @Override
    public boolean getEnabledStatus() {
        return afsChecker != null;
    }

    @Override
    public void noTraceCheck(String data) {
        if (afsChecker == null) {
            log.info("man machine authentication is not enabled");
            return;
        }
        if (StrUtil.isBlank(data)) {
            throw new BusinessException(MAN_MACHINE_VERIFICATION_FAILED);
        }
        else if (constProperties.getLoginToken() != null && constProperties.getLoginToken().contains(data)) {
            return;
        }
        String scoreJsonStr = "{\"200\":\"PASS\",\"400\":\"NC\",\"600\":\"NC\",\"700\":\"NC\",\"800\":\"BLOCK\"}";
        String result = afsChecker.noTraceCheck(data, scoreJsonStr);
        log.info("human machine verification results:{}", result);
        ExceptionUtil.isNotNull(result, SECONDARY_VERIFICATION);
        switch (result) {
            case "100":
            case "200":
                // directly through
                break;
            case "400":
            case "600":
            case "700":
                // evoke slider captcha
                throw new BusinessException(SECONDARY_VERIFICATION);
            case "800":
                // authentication failed directly intercept
                throw new BusinessException(MAN_MACHINE_VERIFICATION_FAILED);
            case "900":
                // After the slider verification continues to be identified as illegal by risk control,
                // enable SMS verification code verification
                throw new BusinessException(ENABLE_SMS_VERIFICATION);
            default:
                break;
        }
    }
}
