"use client"
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import './input.css';

type InputType = 'text' | 'textarea' | 'number' | 'tel' | 'email' | 'password';

type InputProps = {
  label: string;
  id: string;
  classes?: string;
} & (
  | (ComponentPropsWithoutRef<"input"> & { type: Exclude<InputType, 'textarea'> })
  | (ComponentPropsWithoutRef<"textarea"> & { type: 'textarea' })
);

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, id, classes, type, ...props }, ref) => {
    return (
      <span className={`${classes ? classes : ''} input-wrapper input--${type || 'text'}`}>
        <label htmlFor={id}>{label}</label>
        {type === 'textarea' && 
          (<textarea id={id} name={id} ref={ref as React.Ref<HTMLTextAreaElement>} {...(props as ComponentPropsWithoutRef<'textarea'>)} />)
        }
        {type !== 'textarea' && 
          (<input id={id} name={id} ref={ref as React.Ref<HTMLInputElement>} type={type as Exclude<InputType, 'textarea'>} {...(props as ComponentPropsWithoutRef<'input'>)} />)
        }
      </span>
    );
  }
);

Input.displayName = "Input";

export default Input;
