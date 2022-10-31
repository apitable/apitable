package com.vikadata.boot.autoconfigure.mail;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import javax.mail.util.ByteArrayDataSource;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ArrayUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.ConfigurableMimeFileTypeMap;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

/**
 * <p>
 * Mail send api
 * </p>
 *
 * @author Benson Cheung
 */
public class MailSendService implements MailTemplate {

    private static final Logger LOGGER = LoggerFactory.getLogger(MailSendService.class);

    private final MailProperties properties;

    private final JavaMailSender sender;

    public MailSendService(MailProperties properties, JavaMailSender sender) {
        this.properties = properties;
        this.sender = sender;
    }

    @Override
    public void send(EmailMessage emailMessage) {
        this.send(new EmailMessage[] { emailMessage });
    }

    @Override
    public void send(EmailMessage... emailMessages) {
        MimeMessage[] messages = new MimeMessage[emailMessages.length];
        try {
            for (int i = 0; i < emailMessages.length; i++) {
                MimeMessage message = createMimeMessage(emailMessages[i]);
                messages[i] = message;
            }
            sender.send(messages);
        }
        catch (MessagingException | IOException | MailException exception) {
            exception.printStackTrace();
            String ignoreInfo = "Invalid Addresses";
            if (!exception.getMessage().contains(ignoreInfo)) {
                LOGGER.error("send email fail", exception);
            }
        }
    }

    private MimeMessage createMimeMessage(EmailMessage emailMessage) throws MessagingException, IOException {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(new InternetAddress(properties.getUsername(), emailMessage.getPersonal()));
        // set recipient
        helper.setTo(ArrayUtil.toArray(emailMessage.getTo(), String.class));
        // set CC
        if (!CollectionUtils.isEmpty(emailMessage.getCc())) {
            helper.setCc(ArrayUtil.toArray(emailMessage.getCc(), String.class));
        }
        // subject
        helper.setSubject(emailMessage.getSubject());
        // email content
        if (StringUtils.hasText(emailMessage.getPlainText())) {
            helper.setText(emailMessage.getPlainText(), emailMessage.getHtmlText());
        }
        else {
            helper.setText(emailMessage.getHtmlText(), true);
        }
        // inline resource
        if (emailMessage.getInlines() != null && !emailMessage.getInlines().isEmpty()) {
            Map<String, InputStream> inlines = emailMessage.getInlines();
            for (Map.Entry<String, InputStream> entry : inlines.entrySet()) {
                ByteArrayResource resource = new ByteArrayResource(IoUtil.readBytes(entry.getValue()));
                helper.addInline(entry.getKey(), resource);
            }
        }

        if (!CollectionUtils.isEmpty(emailMessage.getAttaches())) {
            // Send Attachment
            List<EmailMessage.EmailAttach> attaches = emailMessage.getAttaches();
            for (EmailMessage.EmailAttach attach : attaches) {
                // Get Mime Type
                ConfigurableMimeFileTypeMap ftm = new ConfigurableMimeFileTypeMap();
                String mimeType = ftm.getContentType(attach.getAttachName());
                // Read Attachment Resources
                ByteArrayDataSource source = new ByteArrayDataSource(attach.getSource(), mimeType);
                // Solve the problem of garbled code
                String fileName = MimeUtility.encodeText(attach.getAttachName(), StandardCharsets.UTF_8.name(), "B");
                helper.addAttachment(fileName, source);
            }
        }
        return message;
    }
}
