# Antd Component Overload Flow


less Index path
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
            - Business Components

## Basic Flow

0. Prefer to use the props exposed by the component, custom components
1. when props are not satisfied, override the corresponding variable name in the theme first
2. override the antd component class name if overriding the variable name is not possible
3. if overriding the antd component style is not sufficient, check whether the required component exists under pc/components/common
4. If all of them cannot be satisfied, ask the designer if it can be cut and replaced by a common component implementation (show our own antd documentation website demo)
5. If you can't cut it, write it yourself, and create a new component under pc/components/common


## Override generic style

See https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less for overridable variable names

The first 150 lines are all generic style related variables.

Colors, fonts, spacing, borders, shadows, etc. are modified in [custom_antd_style.less](. /custom_antd_style.less).


## Overriding Global Components

Overriding variable names & overriding class names are written uniformly in the `Component names.less` file under this directory (src/pc/styles/global_components)

### Overriding variable names

Take overloading `Slider` component as an example.
1. Go to [default.less](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) and find the corresponding component variable name. 2.
2. Paste all the variable names related to this component into the new `slider.less` and comment them out.
3. Uncomment the variable names you want to change and change them to the desired effect.

For example, change the background color of the slider default track and the background color of the hover to our brand color.

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

### Overriding class names

When overriding the variable name is not possible, you can override the class name.

For example, the height of the `slider` component on the design is `2px`. The slider component does not expose props like `height` for us to customize the height. The variable names above also do not expose the relevant configuration.
We can override the corresponding css class name in the slider component (you need to find it yourself using browser devtools)

```less
.ant-slider{
  .ant-slider-track{
    height: 2px;
  }
}
```