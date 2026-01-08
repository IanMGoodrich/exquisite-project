"use client"

import { type ComponentPropsWithoutRef, type FC } from "react";
import "./button.css";

export type ButtonAsInterface = "button" | "link"

type ButtonProps = {
  el: "button";
  as?: ButtonAsInterface;
  secondary?: boolean;
  classes?: string;
} & ComponentPropsWithoutRef<"button">;


type LinkProps = {
  el: "link";
  as?: ButtonAsInterface;
  secondary?: boolean;
  classes?: string;
} & ComponentPropsWithoutRef<"a">;  


const Button: FC<ButtonProps | LinkProps> = ({...props}) => {
  const styleAs = props.as? ` as-${props.as}` : `as-${props.el}`;
  const isSecondary = props.secondary ? "secondary" : "";

  if (props.el === "link") {
    return (
      <a className={`button ${styleAs} ${isSecondary} ${props.classes}`} {...props} />
    );
  }
  return (
    <button className={`button ${styleAs} ${isSecondary} ${props.classes}`} {...props} />
  );
}

export default Button;
