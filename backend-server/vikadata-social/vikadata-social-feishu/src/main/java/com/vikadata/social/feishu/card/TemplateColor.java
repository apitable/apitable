package com.vikadata.social.feishu.card;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 标题背景颜色
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 13:28
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
