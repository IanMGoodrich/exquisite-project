import { type ComponentPropsWithoutRef, type FC } from "react";
import "./button.css";

type ButtonProps = {
  el: "button";
} & ComponentPropsWithoutRef<"button">;


type LinkProps = {
  el: "link";
} & ComponentPropsWithoutRef<"a">;  


const Button: FC<ButtonProps | LinkProps> = ({...props}) => {
  if (props.el === "link") {
    return (
      <a className="button" {...props} />
    );
  }
  return (
    <button className="button" {...props} />
  );
}

export default Button;
