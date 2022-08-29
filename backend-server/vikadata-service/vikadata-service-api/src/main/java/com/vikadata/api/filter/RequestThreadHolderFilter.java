package com.vikadata.api.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.holder.AuditFieldHolder;
import com.vikadata.api.holder.LoginUserHolder;
import com.vikadata.api.holder.MemberHolder;
import com.vikadata.api.holder.NotificationRenderFieldHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.social.feishu.FeishuConfigStorageHolder;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.vikadata.api.constants.FilterConstants.REQUEST_THREAD_HOLDER_FILTER;


/**
 * <p>
 * 请求过滤器
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/9 19:50
 */
@Component
@Slf4j
public class RequestThreadHolderFilter extends OncePerRequestFilter implements Ordered {

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        //临时保存器
        UserHolder.init();
        LoginUserHolder.init();
        SpaceHolder.init();
        MemberHolder.init();
        AuditFieldHolder.init();
        NotificationRenderFieldHolder.init();

        try {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        }
        finally {
            UserHolder.remove();
            LoginUserHolder.remove();
            SpaceHolder.remove();
            MemberHolder.remove();
            AuditFieldHolder.remove();
            NotificationRenderFieldHolder.remove();
            FeishuConfigStorageHolder.remove();
        }
    }

    @Override
    public int getOrder() {
        return REQUEST_THREAD_HOLDER_FILTER;
    }
}
