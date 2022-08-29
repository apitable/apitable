package com.vikadata.api.context;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;

import com.vikadata.api.constants.SessionAttrConstants;
import com.vikadata.api.enums.exception.AuthException;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.session.data.redis.RedisIndexedSessionRepository;
import org.springframework.session.web.http.CookieSerializer.CookieValue;
import org.springframework.session.web.http.DefaultCookieSerializer;

/**
 * <p>
 * Session上下文快速操作工具
 * 只提供快速获取用户ID
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 18:14
 */
public class SessionContext {

    private static final RedisIndexedSessionRepository sessionRepository;

    private static final DefaultCookieSerializer cookieSerializer;

    static {
        sessionRepository = SpringContextHolder.getBean(RedisIndexedSessionRepository.class);
        cookieSerializer = SpringContextHolder.getBean(DefaultCookieSerializer.class);
    }

    public static void setExternalId(Long userId, String externalId) {
        HttpSession session = getSession(true);
        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userId.toString());
        session.setAttribute(SessionAttrConstants.LOGIN_USER_ID, userId);
        session.setAttribute(SessionAttrConstants.EXTERNAL_ID, externalId);
        UserHolder.set(userId);
    }

    /**
     * 获取会话里的UserId
     *
     * @return UserId
     */
    public static Long getUserId() {
        Long userId = UserHolder.get();
        if (userId == null) {
            HttpSession session = getSession(false);
            Object value = session.getAttribute(SessionAttrConstants.LOGIN_USER_ID);
            if (value == null) {
                throw new BusinessException(AuthException.UNAUTHORIZED);
            }
            userId = NumberUtil.parseLong(value.toString());
        }
        return userId;
    }

    /**
     * 设置用户ID到Session
     *
     * @param userId 用户ID
     */
    public static void setUserId(Long userId) {
        HttpSession session = getSession(true);
        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userId.toString());
        session.setAttribute(SessionAttrConstants.LOGIN_USER_ID, userId);
        UserHolder.set(userId);
    }

    /**
     * 获取会话里的UserId, 不抛出异常
     *
     * @return UserId
     */
    public static Long getUserIdWithoutException() {
        Long userId = UserHolder.get();
        if (userId == null) {
            HttpSession session = HttpContextUtil.getSession(false);
            if (session == null) {
                return null;
            }
            Object value = session.getAttribute(SessionAttrConstants.LOGIN_USER_ID);
            if (value == null) {
                return null;
            }
            userId = NumberUtil.parseLong(value.toString());
        }
        return userId;
    }

    /**
     * 设置用户ID、微信会员ID到Session
     *
     * @param userId         用户ID
     * @param wechatMemberId 微信会员ID
     */
    public static void setId(Long userId, Long wechatMemberId) {
        HttpSession session = getSession(true);
        if (userId != null) {
            session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userId.toString());
            session.setAttribute(SessionAttrConstants.LOGIN_USER_ID, userId);
        }
        if (wechatMemberId != null) {
            session.setAttribute(SessionAttrConstants.WECHAT_MEMBER_ID, wechatMemberId);
        }
    }

    /**
     * 获取会话里的微信会员ID
     *
     * @return wechatMemberId
     */
    public static Long getWechatMemberId() {
        HttpSession session = getSession(false);
        Object value = session.getAttribute(SessionAttrConstants.WECHAT_MEMBER_ID);
        if (value == null) {
            throw new BusinessException(AuthException.UNAUTHORIZED);
        }
        return NumberUtil.parseLong(value.toString());
    }

    /**
     * 设置钉钉会员ID到Session
     *
     * @param userId   钉钉会员信息
     * @param userName 钉钉会员名称
     */
    public static void setDingTalkUserId(String userId, String userName) {
        HttpSession session = HttpContextUtil.getSession(true);
        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userId);
        if (userId != null) {
            session.setAttribute(SessionAttrConstants.DINGTALK_USER_ID, userId);
        }
        if (userName != null) {
            session.setAttribute(SessionAttrConstants.DINGTALK_USER_NAME, userName);
        }
    }

    /**
     * 获取会话中的钉钉会员信息
     *
     * @return String 钉钉会员信息
     */
    public static String getDingtalkUserId() {
        HttpSession session = HttpContextUtil.getSession(false);
        Object value = session.getAttribute(SessionAttrConstants.DINGTALK_USER_ID);
        if (value == null) {
            return null;
        }
        return (String) value;
    }

    /**
     * 获取会话中的钉钉会员名称
     *
     * @return String 钉钉会员信息名称
     */
    public static String getDingtalkUserName() {
        HttpSession session = HttpContextUtil.getSession(false);
        Object value = session.getAttribute(SessionAttrConstants.DINGTALK_USER_NAME);
        if (value == null) {
            return null;
        }
        return (String) value;
    }

    /**
     * 关闭会话，并删除
     */
    public static void cleanContext(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    private static HttpSession getSession(boolean create) {
        HttpSession session = HttpContextUtil.getSession(create);
        if (session == null) {
            throw new BusinessException(AuthException.UNAUTHORIZED);
        }
        return session;
    }

    /**
     * 拷贝session到指定域名
     * @param request       HttpServletRequest
     * @param response      HttpServletResponse
     * @param targetDomain  targetDomain
     */
    public static void copySessionToDomain(HttpServletRequest request, HttpServletResponse response, String targetDomain) {
        HttpSession session = request.getSession(false);
        if (null != session) {
            Session redisSession = sessionRepository.findById(session.getId());
            if (null != redisSession) {
                CookieValue cookieValue = new CookieValue(request, response, redisSession.getId());
                cookieSerializer.setDomainName(targetDomain);
                cookieSerializer.setCookiePath("/");
                cookieSerializer.writeCookieValue(cookieValue);
            }
        }
    }

    public static void copySessionToDomain(String targetDomain) {
        copySessionToDomain(HttpContextUtil.getRequest(), HttpContextUtil.getResponse(), targetDomain);
    }

    /**
     * 移除cookie
     *
     * @param response   HttpServletResponse
     * @param cookieNmae cookie名称
     * @author Pengap
     * @date 2022/4/20 18:34:38
     */
    public static void removeCookie(HttpServletResponse response, String cookieNmae, String cookiePath) {
        if (null == response || StrUtil.isBlank(cookieNmae)) {
            return;
        }
        // 将Cookie的值设置为null
        Cookie cookie = new Cookie(cookieNmae, null);
        //将`Max-Age`设置为0
        cookie.setMaxAge(0);
        cookie.setPath(cookiePath);
        response.addCookie(cookie);
    }
}
