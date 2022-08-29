package com.vikadata.api.auth;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.SessionContext;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.connector.k11.K11Connector;
import com.vikadata.connector.k11.model.SsoAuthInfo;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 连接器入口
 * </p>
 *
 * @author Chambers
 * @date 2021/6/25
 */
@Slf4j
@Component
public class ConnectorTemplate {

    @Autowired(required = false)
    private K11Connector k11Connector;

    @Resource
    private IUserService iUserService;

    public void loginBySsoToken(String token){
        log.info("sso token 「{}」登录", token);
        if (k11Connector != null) {
            try {
                SsoAuthInfo authInfo = k11Connector.loginBySsoToken(token);
                // k11 电话号码可能是座机，不做自动绑定
                // 判断邮箱是否已注册维格帐号
                UserEntity user = iUserService.getByEmail(authInfo.getEmailAddr());
                if (user != null) {
                    // 更新最后登陆时间
                    iUserService.updateLoginTime(user.getId());
                    // 登录成功，保存session
                    SessionContext.setUserId(user.getId());
                    return;
                }
                Long registerUserId = iUserService.create(null, null,
                    authInfo.getUserDisplayName(), null, authInfo.getEmailAddr(),"");
                // 登录成功，保存session
                SessionContext.setUserId(registerUserId);
                return;
            }
            catch (Exception e) {
                log.error("sso token「{}」登录失败。msg:{}", token, e.getMessage());
                throw new BusinessException("SSO 认证失败");
            }
        }
        throw new BusinessException("该环境暂不支持 SSO 方式登录");

    }

    public Long loginBySso(String username, String credential) {
        log.info("sso 帐号「{}」登录", username);
        if (k11Connector != null) {
            try {
                // k11 电话号码可能是座机，不做自动绑定
                SsoAuthInfo authInfo = k11Connector.loginBySso(username, credential);
                // 判断邮箱是否已注册维格帐号
                UserEntity user = iUserService.getByEmail(authInfo.getEmailAddr());
                if (user != null) {
                    // 更新最后登陆时间
                    iUserService.updateLoginTime(user.getId());
                    return user.getId();
                }
                return iUserService.create(null, null,
                        authInfo.getUserDisplayName(), null, authInfo.getEmailAddr(),"");
            } catch (Exception e) {
                log.error("sso 帐号「{}」登录失败。msg:{}", username, e.getMessage());
                throw new BusinessException("SSO 登录失败");
            }
        }
        throw new BusinessException("该环境暂不支持 SSO 方式登录");
    }

    public void sendSms(String target, String code) {
        if (k11Connector != null) {
            try {
                k11Connector.sendSms(target, code);
            } catch (Exception e) {
                throw new BusinessException("短信发送失败");
            }
            return;
        }
        throw new BusinessException("未开启外部连接的短信服务");
    }
}
