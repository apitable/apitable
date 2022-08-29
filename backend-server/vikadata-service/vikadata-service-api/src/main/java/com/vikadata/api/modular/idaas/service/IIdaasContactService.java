package com.vikadata.api.modular.idaas.service;

/**
 * <p>
 * 玉符 IDaaS 通讯录
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 14:27:27
 */
public interface IIdaasContactService {

    /**
     * 同步通讯录
     *
     * @param spaceId 要同步的空间 ID
     * @param userId 操作的维格用户 ID
     * @author 刘斌华
     * @date 2022-05-25 15:17:26
     */
    void syncContact(String spaceId, Long userId);

}
