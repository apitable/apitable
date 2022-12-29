package com.vikadata.social.feishu;

/**
 * message receiver constructor
 */
public class MessageReceiverBuilder {

    public static MessageReceiver openId(String id) {
        return new OpenId(id);
    }

    public static MessageReceiver chatId(String id) {
        return new ChatId(id);
    }

    public static MessageReceiver userId(String id) {
        return new UserId(id);
    }

    public static MessageReceiver email(String id) {
        return new Email(id);
    }

    private static abstract class AbstractMessageMessageReceiver implements MessageReceiver {

        private final String value;

        AbstractMessageMessageReceiver(String value) {
            this.value = value;
        }

        @Override
        public String value() {
            return value;
        }
    }

    public static class OpenId extends AbstractMessageMessageReceiver {
        OpenId(String identity) {
            super(identity);
        }
    }

    public static class ChatId extends AbstractMessageMessageReceiver {

        ChatId(String identity) {
            super(identity);
        }
    }

    public static class UserId extends AbstractMessageMessageReceiver {
        UserId(String identity) {
            super(identity);
        }
    }

    public static class Email extends AbstractMessageMessageReceiver {
        Email(String identity) {
            super(identity);
        }
    }
}
