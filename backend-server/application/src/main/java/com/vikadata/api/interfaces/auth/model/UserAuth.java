package com.vikadata.api.interfaces.auth.model;

public class UserAuth {

    private Long userId;

    public UserAuth(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }
}
