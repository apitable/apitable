package com.vikadata.api.interfaces.security.facade;

import com.vikadata.api.interfaces.security.model.NonRobotMetadata;

public interface HumanVerificationServiceFacade {

    void verifyNonRobot(NonRobotMetadata metadata);
}
