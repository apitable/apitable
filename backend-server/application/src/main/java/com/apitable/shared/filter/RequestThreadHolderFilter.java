/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import com.apitable.shared.holder.LoginUserHolder;
import com.apitable.shared.holder.MemberHolder;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.holder.UserHolder;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.apitable.shared.constants.FilterConstants.REQUEST_THREAD_HOLDER_FILTER;


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
        }
    }

    @Override
    public int getOrder() {
        return REQUEST_THREAD_HOLDER_FILTER;
    }
}
