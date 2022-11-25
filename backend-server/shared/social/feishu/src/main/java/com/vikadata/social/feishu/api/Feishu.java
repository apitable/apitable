package com.vikadata.social.feishu.api;

/**
 * Feishu related interfaces
 */
public interface Feishu {

    /**
     * Authorization management interface
     * @return Authorization management interface
     */
    AuthOperations authOperations();

    /**
     * Application management interface
     * @return Application management interface
     */
    AppOperations appOperations();

    /**
     * Contacts management interface
     * @return Contacts management interface
     */
    ContactOperations contactOperations();

    /**
     * User management interface
     * @return User management interface
     */
    UserOperations userOperations();

    /**
     * Department management interface
     * @return Department management interface
     */
    DepartmentOperations departmentOperations();

    /**
     * Robot interface
     * @return Robot interface
     */
    BotOperations botOperations();

    /**
     * message card interface
     * @return message card interface
     */
    MessageOperations messageOperations();

    /**
     * Enterprise Information Interface
     * @return Enterprise Information Interface
     */
    TenantOperations tenantOperations();

    /**
     * Picture operation interface
     * @return Picture operation interface
     */
    ImageOperations imageOperations();
}
