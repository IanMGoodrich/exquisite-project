import { forwardRef, type ComponentPropsWithoutRef } from "react";
import './input.css';

type InputProps = {
  label: string;
  id: string;
} & ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <p className={`input-wrapper input--${props.type || 'text'}`}>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={id} ref={ref} {...props} />
      </p>
    );
  }
);

Input.displayName = "Input";

export default Input;
