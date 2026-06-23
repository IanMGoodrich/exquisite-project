"use client"

import Button from "../button/button";
import './modal.css';
import { useDraggable } from "../../lib/useDraggable";

export type ModalVariants = 'inspiration'|'default'

interface MovableModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: ModalVariants;
}

const Modal: React.FC<MovableModalProps> = ({
  onClose,
  title,
  children,
  variant = 'default',
}) => {
  // Center the modal on the screen initially
  const { position, dragHandleRef } = useDraggable(
    window.innerWidth * 0.25,
    window.innerHeight * 0.02,
  );

  return (
    <div
      className="modal"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      data-variant={variant}
    >
      <div className="modal--main" >
        <div className="modal--control" ref={dragHandleRef}>
          {title && <h3 className="modal--title">{title}</h3>}
          <Button
            el="button"
            as="button"
            onClick={onClose}
            variant="icon-only"
            svg="close"
            classes="modal--button-close"
          />
        </div>
        <div className="modal--content-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default Modal;