package com.vikadata.scheduler.space.service;

public interface IUserService {

    /**
     * 关闭冷静期账号，其中该账号已申请注销超过limitDays
     * @param limitDays
     */
    void closePausedUser(int limitDays);

    /**
     * 修复V币积分覆盖问题
     *
     * @author liuzijing
     * @date 2022/4/7
     */
    void integralClean();

}
