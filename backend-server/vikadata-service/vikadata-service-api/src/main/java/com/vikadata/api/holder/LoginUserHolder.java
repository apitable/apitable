package com.vikadata.api.holder;

import com.vikadata.api.cache.bean.LoginUserDto;

/**
 * <p>
 * 当前登录用户的临时保存容器
 * 说明：
 * 当OPEN_UP_FLAG标识在ThreadLocal里为true
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 16:10
 */
public class LoginUserHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();

    private static final ThreadLocal<LoginUserDto> LOGIN_USER_HOLDER = new ThreadLocal<>();

    /**
     *
     * 初始化
     */
    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会set失效
     *
     * @param loginUserDto 当前登录用户
     * @author Shawn Deng
     * @date 2019/10/29 16:10
     */
    public static void set(LoginUserDto loginUserDto) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            LOGIN_USER_HOLDER.set(loginUserDto);
        }
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会get值为null
     *
     * @return LoginUser
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static LoginUserDto get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        }
        else {
            return LOGIN_USER_HOLDER.get();
        }
    }

    /**
     * 删除临时保存的用户
     *
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static void remove() {
        OPEN_UP_FLAG.remove();
        LOGIN_USER_HOLDER.remove();
    }
}
