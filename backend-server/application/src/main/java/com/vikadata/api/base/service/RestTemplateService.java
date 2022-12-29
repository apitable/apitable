package com.vikadata.api.base.service;

import java.util.List;

import com.vikadata.api.workspace.ro.FieldPermissionChangeNotifyRo;
import com.vikadata.api.workspace.ro.NodeShareDisableNotifyRo;

/**
 * RestTemplate service
 */
public interface RestTemplateService {

    /**
     * turn off node sharing notifications
     *
     * @param message request message
     */
    void disableNodeShareNotify(List<NodeShareDisableNotifyRo> message);

    /**
     * field permission change notification
     *
     * @param  message request message
     */
    void fieldPermissionChangeNotify(FieldPermissionChangeNotifyRo message);
}
