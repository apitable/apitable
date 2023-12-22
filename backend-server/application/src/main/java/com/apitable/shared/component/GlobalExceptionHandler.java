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

package com.apitable.shared.component;

import static com.apitable.base.enums.ParameterException.INCORRECT_ARG;
import static com.apitable.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_CODE;

import cn.hutool.core.map.MapUtil;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.shared.context.I18nContext;
import jakarta.validation.ConstraintViolationException;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.beetl.core.BeetlKit;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.server.ResponseStatusException;

/**
 * <p>
 * Global Exception Capture in webmvc.
 * </p>
 *
 * @author Benson Cheung
 */
@Component
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
            .body(new ErrorResponse(exception.getStatusCode().value(), exception.getReason()));
    }

    /**
     * error response.
     */
    @Getter
    @Setter
    static class ErrorResponse {

        private int status;
        private String errorMessage;

        public ErrorResponse(int status, String errorMessage) {
            this.status = status;
            this.errorMessage = errorMessage;
        }
    }

    /**
     * handle business exception.
     *
     * @param ex business exception
     * @return response data
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public ResponseData<Void> businessException(BusinessException ex) {
        // get i18n message
        String i18nErrorMessage = I18nContext.me()
            .transform(ex.getFixedCode(), LocaleContextHolder.getLocale(), ex.getMessage());
        if (MapUtil.isNotEmpty(ex.getBody())) {
            i18nErrorMessage = BeetlKit.render(i18nErrorMessage, ex.getBody());
        }
        return ResponseData.error(
            ex.getCode() == null || ex.getCode() == 0 ? DEFAULT_ERROR_CODE : ex.getCode(),
            i18nErrorMessage);
    }

    /**
     * handle validation exception.
     *
     * @param exception exception
     * @return response data
     */
    @ExceptionHandler({MethodArgumentNotValidException.class, MaxUploadSizeExceededException.class,
        ConstraintViolationException.class})
    @ResponseStatus(HttpStatus.OK)
    public ResponseData<Void> validationBodyException(Exception exception) {
        if (exception instanceof MethodArgumentNotValidException) {
            // argument exception
            MethodArgumentNotValidException e = (MethodArgumentNotValidException) exception;
            BindingResult result = e.getBindingResult();
            if (result.hasErrors()) {
                return ResponseData.error(result.getAllErrors().get(0).getDefaultMessage());
            }
        } else if (exception instanceof ConstraintViolationException e) {
            return ResponseData.error(e.getLocalizedMessage());
        } else if (exception instanceof MaxUploadSizeExceededException) {
            // Upload exceeds the maximum limit exception
            return ResponseData.error(9900, "file too large");
        }
        return ResponseData.error();
    }

    /**
     * handle internal server exception.
     *
     * @param ex exception
     * @return response data
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseData<Void> exception(Exception ex) {
        log.error("internal service exception:", ex);
        if (ex instanceof BindException e) {
            BindingResult result = e.getBindingResult();
            if (result.hasErrors()) {
                return ResponseData.error(result.getAllErrors().get(0).getDefaultMessage());
            }
        } else if (ex instanceof IllegalArgumentException) {
            return ResponseData.error(ex.getLocalizedMessage());
        } else if (ex instanceof HttpRequestMethodNotSupportedException) {
            return ResponseData.error(ex.getLocalizedMessage());
        } else if (ex instanceof HttpMessageNotReadableException) {
            return ResponseData.error(INCORRECT_ARG.getMessage());
        }
        return ResponseData.error();
    }
}
