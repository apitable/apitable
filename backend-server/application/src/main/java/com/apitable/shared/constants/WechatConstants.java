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

package com.apitable.shared.constants;

/**
 * <p>
 * wechat constants.
 * </p>
 *
 * @author Chambers
 */
public class WechatConstants {

    /**
     * miniapp qrcode timeout（unit：second）.
     */
    public static final int TIMEOUT = 10 * 60;

    /**
     * PC qrcode unique prefix.
     */
    public static final String MARK_PRE = "mark_";

    /**
     * scan qrcode unique prefix.
     */
    public static final String QR_SCENE_PRE = "qrscene_";

    /**
     * qrcode with parameter unique prefix.
     */
    public static final String REPLY_QRSCENE_PRE = "qrcode_scene_";

    /**
     * qrcode with parameter trigger vcode.
     */
    public static final String ACTIVITY_CODE_SUF = "_activity_code";
}
