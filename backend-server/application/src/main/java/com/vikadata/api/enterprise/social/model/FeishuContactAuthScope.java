package com.vikadata.api.enterprise.social.model;

import java.util.List;

import cn.hutool.json.JSONObject;
import lombok.Data;

import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import static com.vikadata.social.feishu.constants.FeishuConstants.FEISHU_ROOT_DEPT_ID;

/**
 * Lark Tenant Address Book Authorization Scope Processing Class
 */
@Data
public class FeishuContactAuthScope {

    private List<FeishuDeptObject> departments;

    private List<FeishuUserObject> users;

    public FeishuContactAuthScope() {
    }

    public static FeishuDeptObject createRootDeptObject() {
        FeishuDeptObject deptObject = new FeishuDeptObject();
        deptObject.setDepartmentId(FEISHU_ROOT_DEPT_ID);
        deptObject.setOpenDepartmentId(FEISHU_ROOT_DEPT_ID);
        deptObject.setOrder("0");
        return deptObject;
    }

    @Override
    public String toString() {
        JSONObject object = new JSONObject();
        object.putOnce("departments", this.departments);
        object.putOnce("users", this.users);
        return object.toString();
    }
}
