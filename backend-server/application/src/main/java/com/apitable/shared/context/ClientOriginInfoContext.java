package com.apitable.shared.context;

import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.holder.ClientOriginInfoHolder;
import com.apitable.shared.util.information.ClientOriginInfo;
import jakarta.servlet.http.HttpServletRequest;

/**
 * ClientOriginInfo context.
 *
 * @author Shawn Deng
 */
public class ClientOriginInfoContext {

    public static ClientOriginInfoContext me() {
        return SpringContextHolder.getBean(ClientOriginInfoContext.class);
    }

    /**
     * get if exist in thread local.
     *
     * @param request servlet request
     * @return ClientOriginInfo
     */
    public ClientOriginInfo getClientOriginInfo(HttpServletRequest request) {
        ClientOriginInfo clientOriginInfo = ClientOriginInfoHolder.get();
        if (clientOriginInfo == null) {
            clientOriginInfo = parseClientOriginInfo(request);
            ClientOriginInfoHolder.set(clientOriginInfo);
        }
        return clientOriginInfo;
    }

    private ClientOriginInfo parseClientOriginInfo(HttpServletRequest req) {
        ClientOriginInfo originInfo = new ClientOriginInfo();
        originInfo.setUserAgent(req.getHeader(ParamsConstants.USER_AGENT));
        originInfo.setIp(req.getRemoteAddr());
        originInfo.setCookies(req.getCookies());
        return originInfo;
    }
}
