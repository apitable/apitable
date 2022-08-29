package com.vikadata.boot.autoconfigure.xiaomi;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaomi.aegis.constant.SdkConstants;
import com.xiaomi.aegis.vo.UserInfoVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.Ordered;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.vikadata.boot.autoconfigure.FilterChainOrdered.MIDUN_CAS_FILTER;

/**
 * 米盾过滤器
 * 测试专用
 * @author Shawn Deng
 * @date 2021-06-30 16:29:10
 */
public class CasMidunTestFilter extends OncePerRequestFilter implements Ordered {

    private static final Logger log = LoggerFactory.getLogger(CasMidunTestFilter.class);

    private int order = MIDUN_CAS_FILTER;

    private final UnauthorizedResponseCustomizer customizer;

    public CasMidunTestFilter(UnauthorizedResponseCustomizer customizer) {
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
        UserInfoVO userInfo = new UserInfoVO();
        userInfo.setUser("p-xiaomi-test");
        userInfo.setDisplayName("测试内部账号");
        userInfo.setName("昵称");
        userInfo.setEmail("test@xiaomi.com");
        userInfo.setDepartmentName("云平台");
        userInfo.setMiID("P1234567");
        request.setAttribute(SdkConstants.REQUEST_ATTRIBUTE_USER_INFO_KEY, userInfo);
        filterChain.doFilter(request, response);
    }
}
