package com.vikadata.api.modular.space.lang;

import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-30 18:52:43
 */
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
