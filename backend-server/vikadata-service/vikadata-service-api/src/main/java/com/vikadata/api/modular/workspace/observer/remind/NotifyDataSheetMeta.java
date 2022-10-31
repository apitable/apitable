package com.vikadata.api.modular.workspace.observer.remind;

import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import com.vikadata.api.enums.datasheet.RemindType;
import com.vikadata.api.component.notification.NotifyMailFactory.MailWithLang;
import com.vikadata.api.model.ro.datasheet.RemindExtraRo;

/**
 * <p>
 *  datasheet operation notification source data
 * </p>
 */
@Getter
@Setter
@Accessors(chain = true)
public class NotifyDataSheetMeta {

    RemindType remindType;

    String spaceId;

    String nodeId;

    String viewId;

    String recordId;

    String recordTitle;

    String fieldName;

    String createdAt;

    RemindExtraRo extra;

    Long fromMemberId;

    Long fromUserId;

    List<Long> toMemberIds;

    String notifyId;

    String socialTenantId;

    String socialAppId;

    /**
     * app type(1: internal, 2: isv)
     */
    Integer appType;

    MailRemindParameter mailRemindParameter;

    IMRemindParameter imRemindParameter;

    @Getter
    @Setter
    public static class RemindParameter {

        String fromMemberName;

        Boolean fromMemberNameModified;

        @Nullable
        String spaceName;

        String nodeName;

        @Nonnull
        String notifyUrl;
    }

    @Getter
    @Setter
    public static class MailRemindParameter extends RemindParameter {

        @Nullable
        List<MailWithLang> sendEmails;
    }

    @Getter
    @Setter
    public static class IMRemindParameter extends RemindParameter {

        @Nullable
        String fromOpenId;

        @Nullable
        List<String> sendOpenIds;
    }

}
