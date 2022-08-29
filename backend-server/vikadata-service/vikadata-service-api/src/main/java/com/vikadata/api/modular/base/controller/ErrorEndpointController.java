package com.vikadata.api.modular.base.controller;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;

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
