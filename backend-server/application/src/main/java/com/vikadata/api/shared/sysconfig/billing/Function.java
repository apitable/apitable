package com.vikadata.api.shared.sysconfig.billing;

import java.util.List;

import lombok.Data;

/**
 * <p>
 * Billing Function
 * </p>
 */
@Data
public class Function {

    private String id;
    
    private String type;

    private List<String> features;
}
