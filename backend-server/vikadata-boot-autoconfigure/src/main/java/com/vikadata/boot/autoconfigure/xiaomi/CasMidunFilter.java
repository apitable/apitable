package com.vikadata.boot.autoconfigure.xiaomi;

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

import static com.vikadata.boot.autoconfigure.FilterChainOrdered.MIDUN_CAS_FILTER;

/**
 * 米盾过滤器
 * @author Shawn Deng
 * @date 2021-06-30 16:29:10
 */
public class CasMidunFilter extends OncePerRequestFilter implements Ordered {

    private static final Logger log = LoggerFactory.getLogger(CasMidunFilter.class);

    private int order = MIDUN_CAS_FILTER;

    private final UnauthorizedResponseCustomizer customizer;

    private static PathMatcher matcher = new AntPathMatcher();

    public CasMidunFilter(UnauthorizedResponseCustomizer customizer) {
        this.customizer = customizer;
    }

    @Override
    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            if (log.isDebugEnabled()) {
                httpHeaderLog(request);
            }
            String serverPath = request.getServletPath();
            if (isIgnoreUrl(serverPath)) {
                log.info("配置为忽略的路径,url:{}", serverPath);
                filterChain.doFilter(request, response);
                return;
            }
            //验签，确认米盾身份
            String verifyIdentitySignData = request.getHeader(SdkConstants.HEADER_KEY_SIGN_VERIFY_IDENTITY);
            if (CommonUtil.isEmpty(verifyIdentitySignData)) {
                log.error("没有标识米盾身份的签名数据,url:{}", serverPath);
                // 没有标识米盾身份,返回自定义内容
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
                    // 正确的key不是第一个，调整key的位置减少下次试错次数
                    if (index != 0) {
                        String[] newKeys = AegisSignUtil.clearUpKeys(AegisConfig.publicKeys, index);
                        AegisConfig.setPublicKeys(newKeys);
                    }
                    break;
                }
                index++;
            }
            if (index > 0) {
                log.warn("public key,url:{},尝试次数为:{},", serverPath, index + 1);
            }
            if (CommonUtil.isEmpty(verifyIdentityData)) {
                log.error("检测米盾身份,验签失败,url:{},signData:{}", serverPath, verifyIdentitySignData);
                // 验证米盾身份失败，返回自定义内容
                customizer.customize(response);
                return;
            }
            // 小米账号登录
            String loginType = request.getHeader(SdkConstants.HEADER_KEY_LOGIN_TYPE);
            if (SdkConstants.LOGIN_TYPE_PASSPORT.equalsIgnoreCase(loginType)) {
                log.info("小米账号登录,url:{}", serverPath);
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
            // CAS登录
            log.info("CAS账号登录,url:{}", serverPath);
            String signAndUserSignData = request.getHeader(SdkConstants.HEADER_KEY_SIGN_AND_USER_DATA);
            //没有签名信息不做验签
            if (CommonUtil.isEmpty(signAndUserSignData)) {
                log.info("确认为米盾请求，没有用户的签名数据(bypass|静态资源)，url:{}", serverPath);
                filterChain.doFilter(request, response);
                return;
            }
            //验签，获取用户数据
            String userJson = AegisSignUtil.verifySignGetInfo(signAndUserSignData, currentUsePublicKey);
            //验签失败
            if (CommonUtil.isEmpty(userJson)) {
                log.error("获取用户数据，验签失败,url:{},signData:{}", serverPath, signAndUserSignData);
                // 验证签名失败，返回自定义内容
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
