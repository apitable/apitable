package com.vikadata.api.mock.bean;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class MockInvitation {
    Long userId;

    Long memberId;

    String spaceId;

    String token;

    String nodeId;
}
