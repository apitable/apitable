package com.vikadata.system.config.billing;

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
