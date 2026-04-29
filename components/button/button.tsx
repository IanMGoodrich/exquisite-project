"use client"

import { type ComponentPropsWithoutRef, type FC } from "react";
import "./button.css";
import Icon from '../icon/icon';
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "icon-only";
export type ButtonAsType = "button" | "link"
type ButtonProps = {
  el: "button";
  as?: ButtonAsType;
  variant?: ButtonVariant;
  svg?: string;
  classes?: string;
} & ComponentPropsWithoutRef<"button">;


type LinkProps = {
  el: "link";
  as?: ButtonAsType;
  svg?: string;
  variant?: ButtonVariant;
  classes?: string;
} & ComponentPropsWithoutRef<"a">;  


const Button: FC<ButtonProps | LinkProps> = ({
  variant,
  as,
  el,
  svg,
  classes,
  ...restProps
}) => {
  const styleAs = as ? ` as-${as}` : `as-${el}`;
  const variantStyle = variant ? variant : "primary";
  const supplementalClasses = classes ? classes : "";

  if (el === "link") {
    const linkProps = restProps as ComponentPropsWithoutRef<"a">;
    if (svg) {
      return (
        <a
          className={`button ${styleAs} ${variantStyle} ${supplementalClasses}`}
          {...linkProps}
        >
          <Icon name={svg} />
        </a>
      );
    }
    return (
      <a
        className={`button ${styleAs} ${variantStyle} ${supplementalClasses}`}
        {...linkProps}
      />
    );
  }

  const buttonProps = restProps as ComponentPropsWithoutRef<"button">;
  if (svg) {
    return (
      <button
        className={`button ${styleAs} ${variantStyle} ${supplementalClasses}`}
        {...buttonProps}
      >
        <Icon name={svg} />
      </button>
    );
  }

  return (
    <button
      className={`button ${styleAs} ${variantStyle} ${supplementalClasses}`}
      {...buttonProps}
    />
  );
};

export default Button;
