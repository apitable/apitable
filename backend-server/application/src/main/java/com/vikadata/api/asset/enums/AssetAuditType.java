package com.vikadata.api.asset.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * types of results for image machine review
 *
 * @author Benson Cheung
 */
@Getter
@AllArgsConstructor
public enum AssetAuditType {

    /**
     * The machine does not pass the review, it is a violation type picture
     * */
    BLOCK("block"),

    /**
     * need manual review type image
     * */
    REVIEW("review"),

    /**
     * approved by the machine
     * */
    NORMAL("normal");

    private final String value;
}
