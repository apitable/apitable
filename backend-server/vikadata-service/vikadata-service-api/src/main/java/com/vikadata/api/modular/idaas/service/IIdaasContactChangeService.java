package com.vikadata.api.modular.idaas.service;

import com.vikadata.api.modular.idaas.model.IdaasContactChange;

/**
 * <p>
 * 玉符 IDaaS 通讯录变更统一处理
 * </p>
 * @author 刘斌华
 * @date 2022-06-04 09:25:56
 */
public interface IIdaasContactChangeService {

    /**
     * 同意批量保存 IDaaS 通讯录变更信息
     *
     * @param tenantName 租户名
     * @param spaceId 空间站 ID
     * @param contactChange 通讯录变更信息
     * @author 刘斌华
     * @date 2022-06-04 09:33:00
     */
    void saveContactChange(String tenantName, String spaceId, IdaasContactChange contactChange);

}
