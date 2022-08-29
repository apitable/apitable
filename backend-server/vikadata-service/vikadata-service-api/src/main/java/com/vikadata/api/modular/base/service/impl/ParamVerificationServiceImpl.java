package com.vikadata.api.modular.base.service.impl;

import cn.hutool.core.lang.Validator;
import com.vikadata.api.modular.base.service.ParamVerificationService;
import com.vikadata.core.util.ExceptionUtil;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.UserException.*;

/**
* <p>
* 参数验证服务相关接口实现
* </p>
*
* @author Chambers
* @date 2019/11/30
*/
@Service
public class ParamVerificationServiceImpl implements ParamVerificationService {

    @Override
    public void verifyPhone(String phone) {
        ExceptionUtil.isNotBlank(phone, MOBILE_EMPTY);
        ExceptionUtil.isTrue(Validator.isMobile(phone), MOBILE_ERROR_FORMAT);
    }

    @Override
    public void verifyPassword(String password) {
        ExceptionUtil.isNotBlank(password, PASSWORD_EMPTY);
        ExceptionUtil.isTrue(Validator.isBetween(password.length(), 8 , 24), PASSWORD_ERROR_LENGTH);
        ExceptionUtil.isTrue(Validator.isMatchRegex("^[`~!@#$%^&*()-=+[{]}\\|;:'\",<.>/?\\w]+$", password),
                PASSWORD_ERROR_TYPE);
        ExceptionUtil.isTrue(Validator.isMatchRegex("^.*(?=.{8,24})(?=.*\\d)(?=.*[a-zA-Z]).*$", password),
                PASSWORD_ERROR_FORMAT);
    }
}
