/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.starter.mail.autoconfigure;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * Mail Message Template.
 * </p>
 *
 * @author Benson Cheung
 */
public class EmailMessage {

    /**
     * Sender Personalized Name.
     */
    private String personal;

    private String from;

    /**
     * Recipient list (multiple supported).
     */
    private List<String> to;

    /**
     * Cc list (multiple supported.
     */
    private List<String> cc;

    /**
     * Message subject.
     */
    private String subject;

    /**
     * Plain text content.
     */
    private String plainText;

    /**
     * html text.
     */
    private String htmlText;

    /**
     * Embedded resources (pictures, files, etc.).
     */
    private Map<String, InputStream> inlines;

    /**
     * attaches resources.
     */
    private List<EmailAttach> attaches;

    public String getPersonal() {
        return personal;
    }

    public void setPersonal(String personal) {
        this.personal = personal;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<String> getTo() {
        return to;
    }

    public void setTo(List<String> to) {
        this.to = to;
    }

    public List<String> getCc() {
        return cc;
    }

    public void setCc(List<String> cc) {
        this.cc = cc;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getPlainText() {
        return plainText;
    }

    public void setPlainText(String plainText) {
        this.plainText = plainText;
    }

    public String getHtmlText() {
        return htmlText;
    }

    public void setHtmlText(String htmlText) {
        this.htmlText = htmlText;
    }

    public Map<String, InputStream> getInlines() {
        return inlines;
    }

    public void setInlines(Map<String, InputStream> inlines) {
        this.inlines = inlines;
    }

    public List<EmailAttach> getAttaches() {
        return attaches;
    }

    public void setAttaches(List<EmailAttach> attaches) {
        this.attaches = attaches;
    }

    /**
     * email attch class.
     */
    public static class EmailAttach {

        private String attachName;

        private InputStream source;

        public String getAttachName() {
            return attachName;
        }

        public void setAttachName(String attachName) {
            this.attachName = attachName;
        }

        public InputStream getSource() {
            return source;
        }

        public void setSource(InputStream source) {
            this.source = source;
        }
    }
}
