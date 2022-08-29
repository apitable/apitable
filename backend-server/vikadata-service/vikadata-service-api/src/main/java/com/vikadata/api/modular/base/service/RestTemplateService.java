package com.vikadata.api.modular.base.service;

import java.util.List;

import com.vikadata.api.model.ro.datasheet.FieldPermissionChangeNotifyRo;
import com.vikadata.api.model.ro.node.NodeShareDisableNotifyRo;

/**
 * <p>
 * RestTemplate 服务
 * </p>
 *
 * @author Chambers
 * @date 2020/4/2
 */
public interface RestTemplateService {

    /**
     * 关闭节点分享通知
     *
     * @param message 请求消息
     * @author Chambers
     * @date 2021/3/3
     */
    void disableNodeShareNotify(List<NodeShareDisableNotifyRo> message);

    /**
     * 字段权限变更通知
     *
     * @param  message 请求消息
     * @author Chambers
     * @date 2021/3/31
     */
    void fieldPermissionChangeNotify(FieldPermissionChangeNotifyRo message);
}
