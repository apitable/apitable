package com.vikadata.social.feishu.event.contact.v3;

import java.util.List;

import cn.hutool.json.JSONUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserGroupObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

/**
 * The new version of the contact authorization scope changes
 *
 * @author Shawn Deng
 * @date 2020-12-22 14:24:40
 */
@Setter
@Getter
@ToString
@FeishuEvent("contact.scope.updated_v3")
public class ContactScopeUpdateEvent extends BaseV3ContactEvent {

    private Event event;

    @Setter
    @Getter
    public static class Event {

        private ContactObject added;

        private ContactObject removed;

        public static Event toBean(String jsonString) {
            return JSONUtil.toBean(jsonString, Event.class);
        }

        @Override
        public String toString() {
            return JSONUtil.toJsonStr(this);
        }
    }

    @Setter
    @Getter
    public static class ContactObject {

        private List<FeishuUserObject> users;

        private List<FeishuDeptObject> departments;

        private List<FeishuUserGroupObject> userGroups;
    }

}
