package com.vikadata.api.handler;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_CODE;
import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_MESSAGE;

/**
 * <p>
 * 自定义默认的错误处理方式
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/7 23:17
 */
@Deprecated
public class CustomErrorController extends BasicErrorController {

    public CustomErrorController(ServerProperties serverProperties) {
        super(new DefaultErrorAttributes(), serverProperties.getError());
    }

    /**
     * 覆盖默认的Json响应
     */
    @Override
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        HttpStatus status = getStatus(request);

        //输出自定义的Json格式
        Map<String, Object> map = new HashMap<>(3);
        map.put("success", false);
        map.put("code", DEFAULT_ERROR_CODE);
        map.put("message", DEFAULT_ERROR_MESSAGE);

        return new ResponseEntity<>(map, status);
    }
}
