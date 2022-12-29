package com.vikadata.api.shared.component;

import javax.validation.ConstraintViolationException;

import cn.hutool.core.map.MapUtil;
import lombok.extern.slf4j.Slf4j;
import org.beetl.core.BeetlKit;

import com.vikadata.api.shared.context.I18nContext;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;

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

import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_CODE;

/**
 * <p>
 * Global Exception Capture in webmvc
 * </p>
 *
 * @author Benson Cheung
 */
@Component
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public ResponseData<Void> businessException(BusinessException ex) {
        // get i18n message
        String i18nErrorMessage = I18nContext.me().transform(ex.getFixedCode(), LocaleContextHolder.getLocale(), ex.getMessage());
        if (MapUtil.isNotEmpty(ex.getBody())) {
            i18nErrorMessage = BeetlKit.render(i18nErrorMessage, ex.getBody());
        }
        return ResponseData.error(ex.getCode() == null || ex.getCode() == 0 ? DEFAULT_ERROR_CODE : ex.getCode(), i18nErrorMessage);
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class, MaxUploadSizeExceededException.class, ConstraintViolationException.class })
    @ResponseStatus(HttpStatus.OK)
    public ResponseData<Void> validationBodyException(Exception exception) {
        if (exception instanceof MethodArgumentNotValidException) {
            // argument exception
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
            // Upload exceeds the maximum limit exception
            return ResponseData.error(9900, "file too large");
        }
        return ResponseData.error();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseData<Void> exception(Exception ex) {
        log.error("internal service exception:", ex);
        if (ex instanceof BindException) {
            BindException e = (BindException) ex;
            BindingResult result = e.getBindingResult();
            if (result.hasErrors()) {
                return ResponseData.error(result.getAllErrors().get(0).getDefaultMessage());
            }
        }
        else if (ex instanceof IllegalArgumentException) {
            return ResponseData.error(ex.getLocalizedMessage());
        }
        else if (ex instanceof HttpRequestMethodNotSupportedException) {
            return ResponseData.error(ex.getLocalizedMessage());
        }
        else if (ex instanceof HttpMessageNotReadableException) {
            return ResponseData.error(ex.getLocalizedMessage());
        }
        return ResponseData.error();
    }
}
