package com.vikadata.api.base.controller;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;

import org.springframework.stereotype.Controller;

/**
 * @author Shawn Deng
 */
@Controller
@ApiResource(path = "/")
public class ErrorEndpointController {

    @GetResource(path = "/email_verify", requiredLogin = false)
    public String emailVerify() {
        return "email_verify";
    }
}
