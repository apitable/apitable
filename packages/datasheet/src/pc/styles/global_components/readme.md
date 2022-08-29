# Antd 组件重载流程


less 索引路径
- index.tsx
    - index.less
    - normalize.css
    - Main
        - pc/styles/global.less
            - pc/styles/global_components/index.less
                - ~antd/dist/antd.less
                - pc/styles/global_components/custom_antd_style.less
                - pc/styles/global_components/button.less
                - pc/styles/global_components/modal.less
                - ...
        - main.less
        - Router
            - 业务组件

## 基础流程

0. 优先使用组件暴露的 props，自定义组件
1. props 无法满足时，优先覆盖主题中相应的变量名
2. 覆盖变量名无法满足时，覆盖 antd 组件类名
3. 覆盖 antd 组件样式无法满足时，查看 pc/components/common 下是否存在所需组件
4. 全都无法满足时，先问设计师能不能砍掉，换成通用组件实现（拿出我们自己维护的 antd 文档网站演示比划）
5. 不能砍掉就自己写, 在 pc/components/common 下新建组件


## 覆盖通用样式

可覆盖变量名参见： https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less

前 150 行都是通用样式相关的变量。

颜色、字体、间距、边框、阴影等，在 [custom_antd_style.less](./custom_antd_style.less) 中修改。


## 覆盖通用组件

覆盖变量名&覆盖类名统一写在此目录(src/pc/styles/global_components)下的 `组件名.less` 文件中

### 覆盖变量名

以重载 `Slider` 组件为例。
1. 先去 [default.less](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) 下，找到对应的组件变量名。
2. 把所有的这个组件相关的变量名，粘贴到新建的 `slider.less` 中，注释掉。
3. 取消要修改的变量名注释，改为想要的效果。

例如将 slider 默认 track 的背景色和 hover 时的背景色改成我们的品牌色。

```less
// @slider-margin: 10px 6px 10px;
@slider-track-background-color: @primaryColor;
@slider-track-background-color-hover: @primaryColor;
// @slider-track-background-color: @primary-3;
// @slider-track-background-color-hover: @primary-4;
// @slider-handle-border-width: 2px;
// @slider-handle-background-color: @component-background;
// @slider-handle-color: @primary-3;
// @slider-handle-color-hover: @primary-4;
// @slider-handle-color-focus: tint(@primaryColor, 20%);
// @slider-handle-color-focus-shadow: fade(@primaryColor, 20%);
// @slider-handle-color-tooltip-open: @primaryColor;
// @slider-handle-shadow: 0;
// @slider-dot-border-color: @lineColor-split;
// @slider-dot-border-color-active: tint(@primaryColor, 50%);
// @slider-disabled-color: @disabled-color;
// @slider-disabled-background-color: @component-background;

```

### 覆盖类名

当覆盖变量名无法满足时，可以覆盖类名。

例如设计稿上的 `slider` 组件的高度是 `2px`。slider 组件并没有暴露 `height` 这样的 props 给我们自定义高度。上面的变量名中，也没有暴露相关配置。
我们可以重载 slider 组件中对应的 css 类名（需要自己使用浏览器 devtools 查找）

```less
.ant-slider{
  .ant-slider-track{
    height: 2px;
  }
}
```