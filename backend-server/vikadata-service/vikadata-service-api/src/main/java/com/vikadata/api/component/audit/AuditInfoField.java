package com.vikadata.api.component.audit;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 审计行为信息具体字段
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/23 13:55
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Deprecated
public class AuditInfoField implements Serializable {

    private static final long serialVersionUID = 4200087898778929652L;

    private String oldValue;

    private String newValue;

    private String sourceNodeId;

    private String sourceNodeName;

    private String props;

    private String coverActionVal;

    private String templateId;

    public AuditInfoField(String oldValue, String newValue) {
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}
