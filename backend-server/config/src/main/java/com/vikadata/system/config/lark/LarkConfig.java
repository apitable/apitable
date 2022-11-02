package com.vikadata.system.config.lark;

import java.util.Map;

import lombok.Data;

/** 
* <p> 
* Lark Config
* </p> 
*/
@Data
public class LarkConfig {

    private Map<String, LarkPlan> plans;
}
