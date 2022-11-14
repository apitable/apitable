package com.vikadata.api.space.lang;

import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder(toBuilder = true)
public class UserSpaceSelectCondition {

    private SocialSelector social;

    @Getter
    @Setter
    @Builder(toBuilder = true)
    public static class SocialSelector {

        private List<String> appIds;
    }
}
