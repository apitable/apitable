package com.vikadata.social.feishu.model.builder;

/**
 * User ID Type Constructor
 */
public class UserIdTypeBuilder {

    public static UserIdType openId(String id) {
        return new UserIdTypeBuilder.OpenId(id);
    }

    public static UserIdType unionId(String id) {
        return new UserIdTypeBuilder.UnionId(id);
    }

    public static UserIdType userId(String id) {
        return new UserIdTypeBuilder.UserId(id);
    }

    private static abstract class AbstractUserIdType implements UserIdType {

        private final String value;

        private final String type;

        AbstractUserIdType(String type, String value) {
            this.type = type;
            this.value = value;
        }

        @Override
        public String value() {
            return value;
        }

        @Override
        public String type() {
            return type;
        }
    }

    public static class OpenId extends AbstractUserIdType {

        OpenId(String id) {
            super("open_id", id);
        }
    }

    public static class UnionId extends AbstractUserIdType {

        UnionId(String id) {
            super("union_id", id);
        }
    }

    public static class UserId extends AbstractUserIdType {

        UserId(String id) {
            super("user_id", id);
        }
    }
}
