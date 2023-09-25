package com.apitable.interfaces.ai.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * AI Type.
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum AiType {

    QA("qa"),
    CHAT("chat");

    private final String value;
}
