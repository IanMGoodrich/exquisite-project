"use client"

import { type ComponentPropsWithoutRef, type FC } from "react";
import "./button.css";
import Icon from '../icon/icon';
export type ButtonAsType = "button" | "link"
type ButtonProps = {
  el: "button";
  as?: ButtonAsType;
  secondary?: boolean;
  svg?: string;
  classes?: string;
} & ComponentPropsWithoutRef<"button">;


type LinkProps = {
  el: "link";
  as?: ButtonAsType;
  svg?: string;
  secondary?: boolean;
  classes?: string;
} & ComponentPropsWithoutRef<"a">;  


const Button: FC<ButtonProps | LinkProps> = ({...props}) => {
  const styleAs = props.as? ` as-${props.as}` : `as-${props.el}`;
  const isSecondary = props.secondary ? "secondary" : "";
  const supplementalClasses = props.classes ? props.classes : ''
  if (props.el === "link") {
    if (props.svg) {
      return (
        <a className={`button ${styleAs} ${isSecondary} ${supplementalClasses}`} {...props} >
          <Icon name={props.svg}/>
        </a>
      )
    }
    return (
      <a className={`button ${styleAs} ${isSecondary} ${supplementalClasses}`} {...props} />
    );
  }
  if (props.svg) {
    return (
      <button className={`button ${styleAs} ${isSecondary} ${supplementalClasses}`} {...props}>
        <Icon name={props.svg} />
      </button>
    );
  }
  return (
    <button className={`button ${styleAs} ${isSecondary} ${supplementalClasses}`} {...props} />
  );
}

export default Button;
