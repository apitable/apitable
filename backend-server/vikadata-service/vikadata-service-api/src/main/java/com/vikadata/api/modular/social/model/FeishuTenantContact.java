package com.vikadata.api.modular.social.model;

import java.util.ArrayList;
import java.util.List;

import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

/**
 * 飞书通讯录组装结构
 * @author Shawn Deng
 * @date 2021-09-03 18:13:38
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
