package com.vikadata.api.modular.space.model;

/**
 * <p>
 * Modify space operations (using space integrated with third-party IM)
 * </p>
 */
public enum SpaceUpdateOperate {

    /**
     * update the main administration operation
     */
    UPDATE_MAIN_ADMIN,
    /**
     * modify member info
     */
    UPDATE_MEMBER,
    /**
     * add team
     */
    ADD_TEAM,
    /**
     * update team info
     */
    UPDATE_TEAM,
    /**
     * delete team
     */
    DELETE_TEAM,
    /**
     * delete space
     */
    DELETE_SPACE;

    public static Boolean dingTalkIsvCanOperated(SpaceUpdateOperate value) {
        return value.equals(UPDATE_MEMBER) || value.equals(ADD_TEAM) || value.equals(UPDATE_TEAM) || value.equals(DELETE_TEAM);
    }

    public static boolean weComIsvCanOperated(SpaceUpdateOperate value) {

        return value.equals(UPDATE_MEMBER) || value.equals(ADD_TEAM) || value.equals(UPDATE_TEAM) || value.equals(DELETE_TEAM);

    }

    public static boolean larIsvCanOperated(SpaceUpdateOperate value) {
        return value.equals(UPDATE_MEMBER);
    }

}
