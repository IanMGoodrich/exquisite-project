import {type FormEvent, type ComponentPropsWithoutRef, useRef, forwardRef, useImperativeHandle } from 'react'; 
import './form.css';

type FormProps = ComponentPropsWithoutRef<'form'> & {
  onSave: (value: unknown) => void;
};

export type FormHandle = {
  clear: () => void;   
};

const Form = forwardRef<FormHandle, FormProps>(({onSave, children, ...rest}, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  
  useImperativeHandle(ref, () => {
    return {
      clear(){
        formRef.current?.reset();
      }
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSave(data);
  };

  return(
    <form {...rest} onSubmit={handleSubmit} ref={formRef}>
      {children}
    </form>
  )
});

Form.displayName = "Form";

export default Form;