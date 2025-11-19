"use client"

import { type ComponentPropsWithoutRef, type FC } from "react";
import "./button.css";

export type ButtonAsInterface = "button" | "link"

type ButtonProps = {
  el: "button";
  as?: ButtonAsInterface
} & ComponentPropsWithoutRef<"button">;


type LinkProps = {
  el: "link";
  as?: ButtonAsInterface
} & ComponentPropsWithoutRef<"a">;  


const Button: FC<ButtonProps | LinkProps> = ({...props}) => {
  const styleAs = props.as? ` as-${props.as}` : `as-${props.el}`;

  if (props.el === "link") {
    return (
      <a className={`button ${styleAs}`} {...props} />
    );
  }
  return (
    <button className={`button ${styleAs}`} {...props} />
  );
}

export default Button;
