package com.vikadata.api.shared.sysconfig.lark;

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
