package com.vikadata.boot.autoconfigure.teg;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.xiaomi.aegis.utils.CommonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.teg.TegProperties.SmartProxyHeaderProperty;

import org.springframework.core.Ordered;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.vikadata.boot.autoconfigure.FilterChainOrdered.MIDUN_SMARTPROXY_FILTER;

/**
 * smartProxy Filter
 */
public class SmartProxyFilter extends OncePerRequestFilter implements Ordered {

    private static final Logger log = LoggerFactory.getLogger(SmartProxyFilter.class);

    private int order = MIDUN_SMARTPROXY_FILTER;

    private final UnauthorizedResponseCustomizer customizer;

    private TegProperties properties;

    private static PathMatcher matcher = new AntPathMatcher();

    public SmartProxyFilter(UnauthorizedResponseCustomizer customizer,TegProperties properties) {
        this.customizer = customizer;
        this.properties = properties;
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
            if (isIgnoreUrl(serverPath)){
                log.info("Paths configured to ignore,url:{}", serverPath);
                request.setAttribute(SmartProxyHeaderProperty.REQUEST_IGNORE_URL,serverPath);
                filterChain.doFilter(request, response);
                return;
            }
            // Remove ignore Url in the request to prevent forgery
            request.removeAttribute(SmartProxyHeaderProperty.REQUEST_IGNORE_URL);

            // Check the signature to confirm the identity of the jwt
            String signature = request.getHeader(SmartProxyHeaderProperty.REQUEST_SIGNATURE);
            String staffId = request.getHeader(SmartProxyHeaderProperty.REQUEST_STAFFID);
            String timestampStr  = request.getHeader(SmartProxyHeaderProperty.REQUEST_TIMESTAMP);
            String xRioSeq  = request.getHeader(SmartProxyHeaderProperty.REQUEST_X_RIO_SEQ);
            String staffName  = request.getHeader(SmartProxyHeaderProperty.REQUEST_STAFFNAME);
            String extData = request.getHeader(SmartProxyHeaderProperty.REQUEST_X_EXT_DATA);
            if (CommonUtil.isEmpty(signature) && CommonUtil.isEmpty(staffName)) {
                // No signature information, no verification
                log.error("No signature data identifying teg-Smart Proxy,url:{}", serverPath);
                // Does not identify teg-Smart Proxy identity, returns custom content
                filterChain.doFilter(request, response);
                return;
            }

            long timestamp = Long.parseLong(timestampStr);
            long now = System.currentTimeMillis()/1000;
            if (Math.abs(now - timestamp) > 180 || !signature.equalsIgnoreCase(toSHA256(timestampStr + properties.getTokenKey() + xRioSeq + "," + staffId
                    + "," + staffName + "," + extData + timestampStr)) ) {
                log.info("SmartProxy checkSignature Verification failed ,timestamp = {} , signature = {}", timestampStr ,signature);
                customizer.customize(response);
                return;
            }

            filterChain.doFilter(request, response);
        }
        catch (Throwable e) {
            log.error("SmartProxyFilter check exception", e);
            throw new ServletException(e);
        }
    }

    private boolean isIgnoreUrl(String url) {
        if (properties.getIgnoreUrls() == null || properties.getIgnoreUrls().size() == 0 ){
            return false;
        }
        for (String ignoreUrl : properties.getIgnoreUrls()) {
            if (matcher.match(ignoreUrl, url)) {
                return true;
            }
        }
        return false;
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



    public static String toSHA256(String str) {
        String encodeStr = "";
        try {
            MessageDigest messageDigest;
            messageDigest = MessageDigest.getInstance("SHA-256");
            messageDigest.update(str.getBytes(StandardCharsets.UTF_8));
            encodeStr = byte2Hex(messageDigest.digest());
        }catch (Exception e){
            log.error("toSHA256 str:{},url:{}",str,e.getMessage());
        }
        return encodeStr;
    }

    private static String byte2Hex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        String temp;
        for (byte aByte : bytes) {
            temp = Integer.toHexString(aByte & 0xFF);
            if (temp.length() == 1) {
                result.append("0");
            }
            result.append(temp);
        }
        return result.toString();
    }

}
