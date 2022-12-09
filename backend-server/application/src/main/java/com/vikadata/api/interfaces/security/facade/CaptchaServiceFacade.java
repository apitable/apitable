package com.vikadata.api.interfaces.security.facade;

import com.vikadata.api.interfaces.security.model.CaptchaReceiver;

public interface CaptchaServiceFacade {

    void sendCaptcha(CaptchaReceiver receiver);
}
