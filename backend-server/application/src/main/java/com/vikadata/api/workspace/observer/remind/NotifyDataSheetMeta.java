package com.vikadata.api.workspace.observer.remind;

import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import com.vikadata.api.workspace.ro.RemindExtraRo;

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

    RemindParameter remindParameter;

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
}
