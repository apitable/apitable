package com.vikadata.api.workspace.observer.remind;

public enum MailRemindChannel implements RemindChannel {

    MAIL(0);

    private final int code;

    MailRemindChannel(int code) {
        this.code = code;
    }

    @Override
    public Integer getCode() {
        return code;
    }
}
