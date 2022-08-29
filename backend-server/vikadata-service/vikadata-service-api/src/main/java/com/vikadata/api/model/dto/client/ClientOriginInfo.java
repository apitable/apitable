package com.vikadata.api.model.dto.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.servlet.http.Cookie;

/**
 * <p>
 * 二维码源信息
 * </p>
 *
 * @author Chambers
 * @date 2020/10/23
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientOriginInfo {

    private String ip;

    private String userAgent;

    private Cookie[] cookies;
}
