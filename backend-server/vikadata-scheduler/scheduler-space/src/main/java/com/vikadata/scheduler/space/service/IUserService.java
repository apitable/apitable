package com.vikadata.scheduler.space.service;

public interface IUserService {

    /**
     * Close Paused User
     * Among them, the account has applied for cancellation for more than limit Days
     */
    void closePausedUser(int limitDays);

}
