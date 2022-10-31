package com.vikadata.system.config.audit;

import lombok.Data;

/**
 * <p>
 * Audit
 * </p>
 */
@Data
public class Audit {

    private String content;

    private String type;

    private String category;

    private String name;

    private boolean showInAuditLog;
}
