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
import org.springframework.session.data.redis.RedisIndexedSessionRepository;
import org.springframework.session.web.http.DefaultCookieSerializer;

/**
 * <p>
 * Session context util
 * </p>
 *
 * @author Shawn Deng
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
     * get the user id in the session
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
     * set user id to session
     *
     * @param userId user id
     */
    public static void setUserId(Long userId) {
        HttpSession session = getSession(true);
        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userId.toString());
        session.setAttribute(SessionAttrConstants.LOGIN_USER_ID, userId);
        UserHolder.set(userId);
    }

    /**
     * Get the UserId in the session without throwing an exception
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
     * set user id and wechat open id to session
     *
     * @param userId         user id
     * @param wechatMemberId wechat open id
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
     * get the wechat user id in the session
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
     * set dingtalk user id to session
     *
     * @param userId   dingtalk user id
     * @param userName dingtalk user name
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
     * get dingtalk user information in a session
     *
     * @return String user id
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
     * get the dingtalk user name in the session
     *
     * @return dingtalk user name
     */
    public static String getDingtalkUserName() {
        HttpSession session = HttpContextUtil.getSession(false);
        Object value = session.getAttribute(SessionAttrConstants.DINGTALK_USER_NAME);
        if (value == null) {
            return null;
        }
        return (String) value;
    }

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
     * remove cookie
     *
     * @param response   HttpServletResponse
     * @param cookieName cookie name
     */
    public static void removeCookie(HttpServletResponse response, String cookieName, String cookiePath) {
        if (null == response || StrUtil.isBlank(cookieName)) {
            return;
        }
        Cookie cookie = new Cookie(cookieName, null);
        //set `Max-Age` = 0
        cookie.setMaxAge(0);
        cookie.setPath(cookiePath);
        response.addCookie(cookie);
    }
}
