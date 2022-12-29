package com.vikadata.api.interfaces.security.facade;

public interface BlackListServiceFacade {

    void checkSpace(String spaceId);

    void checkUser(Long userId);
}
