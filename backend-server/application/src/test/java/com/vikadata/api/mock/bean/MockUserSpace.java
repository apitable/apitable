package com.vikadata.api.mock.bean;

public class MockUserSpace {

    Long userId;

    String spaceId;

    public MockUserSpace(Long userId, String spaceId) {
        this.userId = userId;
        this.spaceId = spaceId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public void setSpaceId(String spaceId) {
        this.spaceId = spaceId;
    }
}
