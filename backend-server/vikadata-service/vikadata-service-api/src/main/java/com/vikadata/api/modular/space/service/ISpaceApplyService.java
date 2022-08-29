package com.vikadata.api.modular.space.service;

/**
 * <p>
 * 工作空间-申请表 服务类
 * </p>
 *
 * @author Chambers
 * @date 2020/10/29
 */
public interface ISpaceApplyService {

    /**
     * 创建申请记录
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return ID
     * @author Chambers
     * @date 2020/10/29
     */
    Long create(Long userId, String spaceId);

    /**
     * 处理空间加入申请
     *
     * @param userId   用户ID
     * @param notifyId 通知ID
     * @param agree    是否同意
     * @author Chambers
     * @date 2020/10/29
     */
    void process(Long userId, Long notifyId, Boolean agree);
}
