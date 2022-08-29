package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * Action名称类型
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-09-17 00:26
 *
 */
public enum OTActionNameEnum {
    /**
     * 新增对象
     * */
    OBJECTINSERT("OI"),

    /**
     * 删除对象
     * */
    OBJECTDELETE("OD"),

    /**
     * 更新对象
     * */
    OBJECTREPLACE("OR");

    private String actionName;

    OTActionNameEnum(String actionName){
        this.actionName = actionName;
    }

    public String getActionName(){
        return actionName;
    }

    public void setActionName(String actionName){
        this.actionName = actionName;
    }
}
