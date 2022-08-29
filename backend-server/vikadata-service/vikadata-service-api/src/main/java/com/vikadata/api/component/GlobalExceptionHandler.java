package com.vikadata.api.component;

import javax.validation.ConstraintViolationException;

import cn.hutool.core.map.MapUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.I18nContext;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;

import org.beetl.core.BeetlKit;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import static com.vikadata.api.enums.exception.CoreException.EXCEED_MAX_UPLOAD_SIZE;
import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_CODE;

/**
 * <p>
 * Web框架全局异常捕获,抓取接口所有异常
 * 如果ExceptionHandler声明的ex存在继承关系，则调用栈会执行匹配度最高的异常，即子类异常
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/9/4 16:45
 */
@Component
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 捕获自定义业务异常
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public ResponseData<Void> businessException(BusinessException ex) {
        // 先拿到多语言文案
        String i18nErrorMessage = I18nContext.me().transform(ex.getFixedCode(), LocaleContextHolder.getLocale(), ex.getMessage());
        // 存在变量时，进行渲染
        if(MapUtil.isNotEmpty(ex.getBody())){
            i18nErrorMessage = BeetlKit.render(i18nErrorMessage, ex.getBody());
        }
        return ResponseData.error(ex.getCode() == null || ex.getCode() == 0 ? DEFAULT_ERROR_CODE : ex.getCode(), i18nErrorMessage);
    }

    /**
     * 捕获校验异常的统一处理
     */
    @ExceptionHandler({ MethodArgumentNotValidException.class, MaxUploadSizeExceededException.class, ConstraintViolationException.class })
    @ResponseStatus(HttpStatus.OK)
    public ResponseData<Void> validationBodyException(Exception exception) {
        if (exception instanceof MethodArgumentNotValidException) {
            // 参数异常
            MethodArgumentNotValidException e = (MethodArgumentNotValidException) exception;
            BindingResult result = e.getBindingResult();
            if (result.hasErrors()) {
                return ResponseData.error(result.getAllErrors().get(0).getDefaultMessage());
            }
        }
        else if (exception instanceof ConstraintViolationException) {
            ConstraintViolationException e = (ConstraintViolationException) exception;
            return ResponseData.error(e.getLocalizedMessage());
        }
        else if (exception instanceof MaxUploadSizeExceededException) {
            // 上传超过最大限制异常
            return ResponseData.error(EXCEED_MAX_UPLOAD_SIZE.getCode(), EXCEED_MAX_UPLOAD_SIZE.getMessage());
        }
        return ResponseData.error();
    }

    /**
     * 默认异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseData<Void> exception(Exception ex) {
        log.error("服务内部异常:", ex);
        if (ex instanceof BindException) {
            // 校验框架的参数校验异常
            BindException e = (BindException) ex;
            BindingResult result = e.getBindingResult();
            if (result.hasErrors()) {
                return ResponseData.error(result.getAllErrors().get(0).getDefaultMessage());
            }
        }
        else if (ex instanceof IllegalArgumentException) {
            // 参数异常
            return ResponseData.error(ex.getLocalizedMessage());
        }
        else if (ex instanceof HttpRequestMethodNotSupportedException) {
            // 请求方式不支持
            return ResponseData.error(ex.getLocalizedMessage());
        }
        else if (ex instanceof HttpMessageNotReadableException) {
            // 请求参数不正确
            return ResponseData.error(ex.getLocalizedMessage());
        }
        return ResponseData.error();
    }
}
