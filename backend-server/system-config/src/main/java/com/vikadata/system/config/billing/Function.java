package com.vikadata.system.config.billing;

import java.util.List;

import lombok.Data;

/**
 * <p>
 * 功能点
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/1 14:47
 */
@Data
public class Function {

    private String id;
    
    private String type;

    private List<String> features;
}
