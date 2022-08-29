package com.vikadata.system.config.lark;

import java.util.Map;

import lombok.Data;

/** 
* <p> 
* 飞书配置
* </p> 
* @author zoe zheng 
* @date 2022/2/25 14:03
*/
@Data
public class LarkConfig {

    private Map<String, LarkPlan> plans;
}
