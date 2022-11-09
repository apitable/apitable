package com.apitable.starter.aegis.autoconfigure;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xiaomi.aegis.config.AegisConfig;
import com.xiaomi.aegis.constant.SdkConstants;
import com.xiaomi.aegis.utils.AegisSignUtil;
import com.xiaomi.aegis.utils.CommonUtil;
import com.xiaomi.aegis.vo.UserInfoVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.Ordered;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * xiaomi midun filter
 * @author Shawn Deng
 */
public class CasMidunFilter extends OncePerRequestFilter implements Ordered {

    private static final Logger log = LoggerFactory.getLogger(CasMidunFilter.class);

    private final UnauthorizedResponseCustomizer customizer;

    private static final PathMatcher matcher = new AntPathMatcher();

    public CasMidunFilter(UnauthorizedResponseCustomizer customizer) {
        this.customizer = customizer;
    }

    @Override
    public int getOrder() {
        return LOWEST_PRECEDENCE;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            if (log.isDebugEnabled()) {
                httpHeaderLog(request);
            }
            String serverPath = request.getServletPath();
            if (isIgnoreUrl(serverPath)) {
                log.info("ignore path:{}", serverPath);
                filterChain.doFilter(request, response);
                return;
            }
            String verifyIdentitySignData = request.getHeader(SdkConstants.HEADER_KEY_SIGN_VERIFY_IDENTITY);
            if (CommonUtil.isEmpty(verifyIdentitySignData)) {
                log.error("verify sign data error:{}", serverPath);
                // return custom error data
                customizer.customize(response);
                return;
            }
            String currentUsePublicKey = null;
            String verifyIdentityData = null;
            int index = 0;
            for (String key : AegisConfig.publicKeys) {
                verifyIdentityData = AegisSignUtil.verifySignGetInfo(verifyIdentitySignData, key);
                if (CommonUtil.isNotEmpty(verifyIdentityData)) {
                    currentUsePublicKey = key;
                    // The correct key is not the first. Adjust the key position to reduce the number of trial and error next time
                    if (index != 0) {
                        String[] newKeys = AegisSignUtil.clearUpKeys(AegisConfig.publicKeys, index);
                        AegisConfig.setPublicKeys(newKeys);
                    }
                    break;
                }
                index++;
            }
            if (index > 0) {
                log.warn("public key,url:{},retry times:{},", serverPath, index + 1);
            }
            if (CommonUtil.isEmpty(verifyIdentityData)) {
                log.error("check sign fail, url:{}, signData:{}", serverPath, verifyIdentitySignData);
                // check fail, return error
                customizer.customize(response);
                return;
            }
            // xiaomi user login
            String loginType = request.getHeader(SdkConstants.HEADER_KEY_LOGIN_TYPE);
            if (SdkConstants.LOGIN_TYPE_PASSPORT.equalsIgnoreCase(loginType)) {
                log.info("request path:{}", serverPath);
                String username = request.getHeader(SdkConstants.HEADER_KEY_USER_NAME);
                UserInfoVO userInfo = new UserInfoVO();
                userInfo.setUser(username);
                userInfo.setName(username);
                userInfo.setDisplayName(username);
                request.setAttribute(SdkConstants.REQUEST_ATTRIBUTE_USER_INFO_KEY, userInfo);
                log.info("AegisFilter check success url:{}", serverPath);
                filterChain.doFilter(request, response);
                return;
            }
            // CAS Login
            String signAndUserSignData = request.getHeader(SdkConstants.HEADER_KEY_SIGN_AND_USER_DATA);
            // don't verify sign if it has no user sign data
            if (CommonUtil.isEmpty(signAndUserSignData)) {
                log.info("static resource(bypass)，path:{}", serverPath);
                filterChain.doFilter(request, response);
                return;
            }
            // verify sign and get user
            String userJson = AegisSignUtil.verifySignGetInfo(signAndUserSignData, currentUsePublicKey);
            if (CommonUtil.isEmpty(userJson)) {
                log.error("check sign fail,path:{}, signData:{}", serverPath, signAndUserSignData);
                // return error
                customizer.customize(response);
                return;
            }
            UserInfoVO userInfo = getUserInfo(userJson);
            request.setAttribute(SdkConstants.REQUEST_ATTRIBUTE_USER_INFO_KEY, userInfo);
            log.info("AegisFilter check success,url:{}", serverPath);
            filterChain.doFilter(request, response);
        }
        catch (Throwable e) {
            log.error("AegisFilter check exception", e);
            throw new ServletException(e);
        }
    }

    private void httpHeaderLog(HttpServletRequest request) {
        Map<String, Object> map = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String header = headerNames.nextElement();
            map.put(header, request.getHeader(header));
        }
        Gson gson = new Gson();
        log.debug("Http Headers >>>>{}", gson.toJson(map));
    }

    public static boolean isIgnoreUrl(String url) {
        if (AegisConfig.ignoreUrlArr == null || AegisConfig.ignoreUrlArr.length < 1) {
            return false;
        }
        for (String ignoreUrl : AegisConfig.ignoreUrlArr) {
            if (matcher.match(ignoreUrl, url)) {
                return true;
            }
        }
        return false;
    }

    private UserInfoVO getUserInfo(String userJson) {
        Gson gson = new GsonBuilder().serializeNulls().create();
        return gson.fromJson(userJson, UserInfoVO.class);
    }
}
