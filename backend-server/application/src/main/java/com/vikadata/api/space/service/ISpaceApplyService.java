package com.vikadata.api.space.service;

public interface ISpaceApplyService {

    /**
     * @param userId userId
     * @param spaceId space id
     * @return ID
     */
    Long create(Long userId, String spaceId);

    /**
     * process space join application
     *
     * @param userId userId
     * @param notifyId notify id
     * @param agree    agree or not
     */
    void process(Long userId, Long notifyId, Boolean agree);
}
