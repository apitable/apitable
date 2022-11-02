package com.vikadata.api.modular.social.model;

import java.util.ArrayList;
import java.util.List;

import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

/**
 * Lark Address Book Assembly Structure
 */
public class FeishuTenantContact {

    private List<FeishuDeptObject> deptObjects = new ArrayList<>();

    private List<FeishuUserObject> userObjects = new ArrayList<>();

    public List<FeishuDeptObject> getDeptObjects() {
        return deptObjects;
    }

    public void setDeptObjects(List<FeishuDeptObject> deptObjects) {
        this.deptObjects = deptObjects;
    }

    public List<FeishuUserObject> getUserObjects() {
        return userObjects;
    }

    public void setUserObjects(List<FeishuUserObject> userObjects) {
        this.userObjects = userObjects;
    }
}
