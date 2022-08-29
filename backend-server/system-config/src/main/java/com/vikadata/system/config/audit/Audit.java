package com.vikadata.system.config.audit;

import lombok.Data;

/**
 * 审计
 * @author Shawn Deng
 * @date 2021-11-11 15:08:34
 */
@Data
public class Audit {

    private String content;

    private String type;

    private String category;

    private String name;

    private boolean showInAuditLog;
}
