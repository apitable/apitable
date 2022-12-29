package com.vikadata.social.feishu.card;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * title background color
 */
@Getter
@AllArgsConstructor
public enum TemplateColor {

    BLUE("blue"),

    WATHET("wathet"),

    TURQUOISE("turquoise"),

    GREEN("green"),

    YELLOW("yellow"),

    ORANGE("orange"),

    RED("red"),

    CARMINE("carmine"),

    VIOLET("violet"),

    PURPLE("purple"),

    INDIGO("indigo"),

    GREY("grey");

    private final String color;
}
