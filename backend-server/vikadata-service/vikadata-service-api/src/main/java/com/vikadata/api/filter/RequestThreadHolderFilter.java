package com.vikadata.api.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

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
 * Thread Holder Filter
 * </p>
 *
 * @author Shawn Deng
 */
@Component
@Slf4j
public class RequestThreadHolderFilter extends OncePerRequestFilter implements Ordered {

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        UserHolder.init();
        LoginUserHolder.init();
        SpaceHolder.init();
        MemberHolder.init();
        NotificationRenderFieldHolder.init();

        try {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        }
        finally {
            UserHolder.remove();
            LoginUserHolder.remove();
            SpaceHolder.remove();
            MemberHolder.remove();
            NotificationRenderFieldHolder.remove();
            FeishuConfigStorageHolder.remove();
        }
    }

    @Override
    public int getOrder() {
        return REQUEST_THREAD_HOLDER_FILTER;
    }
}
