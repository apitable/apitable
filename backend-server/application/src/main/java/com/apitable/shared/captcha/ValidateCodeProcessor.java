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

package com.apitable.shared.captcha;

/**
 * <p>
 * check code processor.
 * </p>
 *
 * @author Shawn Deng
 */
public interface ValidateCodeProcessor {

    /**
     * create a verification code and send.
     *
     * @param target Send destination, may be mobile phone or email
     * @param scope  captcha scope
     */
    String createAndSend(ValidateTarget target, CodeValidateScope scope);

    /**
     * create a verification code and send.
     *
     * @param target Send destination, may be mobile phone or email
     * @param scope  captcha scope
     * @param actual real send
     */
    String createAndSend(ValidateTarget target, CodeValidateScope scope, boolean actual);

    /**
     * verify verification code.
     *
     * @param target            Send destination, may be mobile phone or email
     * @param code              verification code
     * @param immediatelyDelete whether to delete immediately
     * @param scope             captcha scope
     */
    void validate(ValidateTarget target, String code, boolean immediatelyDelete,
                  CodeValidateScope scope);

    /**
     * delete verification code.
     *
     * @param target Send destination, which can be mobile phone or email
     * @param scope  captcha scope
     */
    void delCode(String target, CodeValidateScope scope);

    /**
     * save the verification record.
     *
     * @param target Send destination, may be mobile phone or email
     */
    void savePassRecord(String target);

    /**
     * Verify that the verification code has passed the verification.
     *
     * @param target Send destination, may be mobile phone or email
     */
    void verifyIsPass(String target);
}
