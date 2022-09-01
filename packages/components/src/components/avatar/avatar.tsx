import React, { FC, useRef, useLayoutEffect, useState } from "react";
import { IAvatarProps } from "./interface";
import { Box } from "components";
import { AvatarWrapper, AvatarChildWrapper, AvatarSizeConfig } from "./styled";

export const Avatar: FC<IAvatarProps> = ({
  size = "m",
  icon,
  src,
  alt,
  children,
  style,
  shape = "circle"
}) => {
  const avatarNodeRef = useRef<HTMLSpanElement>(null);
  const avatarChildrenRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  let childrenToRender;
  if (typeof src === "string") {
    childrenToRender = (
      <Box
        as="img"
        width="100%"
        height="100%"
        src={src}
        alt={alt}
        display="flex"
      />
    );
  } else if (icon) {
    const finalIcon = React.isValidElement(icon)
      ? React.cloneElement<any>(icon, {
          size: AvatarSizeConfig[size].size * 0.6,
          color: (style && style.color) || "#fff",
          className: "avatar-icon"
        })
      : icon;
    childrenToRender = finalIcon;
  } else {
    childrenToRender = (
      <AvatarChildWrapper
        ref={avatarChildrenRef}
        style={{ transform: `scale(${scale}) translateX(-50%)` }}
      >
        {children}
      </AvatarChildWrapper>
    );
  }

  useLayoutEffect(() => {
    const scale = () => {
      if (typeof src === "string" || icon) return 1;
      if (!avatarChildrenRef.current || !avatarNodeRef.current) return 1;
      const childrenWidth = avatarChildrenRef.current?.offsetWidth;
      const gap = AvatarSizeConfig[size].gap;
      const nodeWidth = avatarNodeRef.current?.offsetWidth - gap;
      return nodeWidth < childrenWidth ? nodeWidth / childrenWidth : 1;
    };
    setScale(scale());
  }, [src, icon, size]);

  const wrapperProps = { size, src, shape, icon, style };

  return (
    <AvatarWrapper {...wrapperProps} ref={avatarNodeRef}>
      {childrenToRender}
    </AvatarWrapper>
  );
};
