package com.vikadata.api.shared.component.notification;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * player user type
 * </p>
 *
 * @author zoe zheng
 */
@AllArgsConstructor
@Getter
public enum PlayerType {

    MEMBER(1),

    MEMBER_DELETED(2),

    VISITORS(3);

    private final Integer type;
}
