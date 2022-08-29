package com.vikadata.api.mediator;

/**
 * @author Shawn Deng
 * @date 2020-11-27 10:58:02
 */
public abstract class AbstractContactSource implements ContactSource {

    /**
     * 通讯录同步中介者
     */
    private AbstractContactMediator mediator;

    public AbstractContactSource(AbstractContactMediator mediator) {
        this.mediator = mediator;
    }

    protected void execute(Object data) {
        this.mediator.sync(data);
    }

    /*protected abstract void onCreateDepartment();

    protected abstract void onUpdateDepartment();

    protected abstract void onDeleteDepartment();

    protected abstract void onNewEmployee();

    protected abstract void onResignEmployee();

    protected abstract void onAddDepartmentEmployee();*/
}
