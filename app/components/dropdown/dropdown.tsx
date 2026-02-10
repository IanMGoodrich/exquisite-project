import { useState, useRef, useId } from "react";
import Button from "../button/button";
import "./dropdown.css";

type DropdownProps = {
  options?: string[];
  children?: React.ReactNode;
  label?: string;
  onClickHandler?: (e: React.MouseEvent) => void;
  onKeyHandler?: (e: React.KeyboardEvent) => void;
  startOpen?: boolean;
};

const Dropdown = ({
  options,
  children,
  label,
  onClickHandler,
  onKeyHandler,
  startOpen,
}: DropdownProps) => {
  const buttonId = useId();
  const firstItemRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(startOpen);

  const toggleOpenClass = (e: React.SyntheticEvent) => {
    const clickedElem = e.target as HTMLElement;
    const clickedId = clickedElem.getAttribute("data-button-id");
    // prevent nested buttons from closing parent dropdown
    if (clickedElem && clickedId && buttonId !== clickedId) {
      return;
    }
    if (menuRef.current) {
      const menu = menuRef?.current as HTMLElement;
      if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        setTimeout(() => setOpen(false), 300);
      } else {
        menu.classList.add("open");
      }
    }
  };

  const handleMenuClick = () => {
    if (!open) {
      setOpen(true);
      if (menuRef.current) {
        const menu = menuRef?.current as HTMLElement;
        menu.classList.add("open");
      }
      setTimeout(() => {
        if (firstItemRef.current && menuRef.current) {
          const el = firstItemRef.current as HTMLElement;
          el.focus();
        }
      }, 0);
    } else {
      setTimeout(() => setOpen(false), 300);
    }
  };
  return (
    <div className="dropdown-wrapper">
      <Button
        classes="dropdown-trigger"
        aria-label="open theme menu"
        aria-haspopup="true"
        el="button"
        as="button"
        data-button-id={buttonId}
        onClick={() => handleMenuClick()}
      >
        {label}
      </Button>
      <ul
        ref={menuRef}
        aria-atomic="true"
        className={`dropdown-list ${open ? "open" : "closed"}`}
        aria-hidden={!open}
        role="menu"
        onClick={toggleOpenClass}
      >
        {options && options.length > 0 && (
          <li
            className="dropdown-item"
            ref={firstItemRef}
            key={options[0]}
            data-value={options[0]}
            onClick={onClickHandler}
            onKeyDown={onKeyHandler}
            tabIndex={open ? 0 : -1}
          >
            {options[0]}
          </li>
        )}
        {options &&
          options.length > 1 &&
          Array.isArray(options) &&
          options.slice(1).map((option: string) => (
            <li
              className="dropdown-item"
              key={option}
              data-value={option}
              onClick={onClickHandler}
              onKeyDown={onKeyHandler}
              tabIndex={open ? 0 : -1}
            >
              {option}
            </li>
          ))}
        {children}
      </ul>
    </div>
  );
};

export default Dropdown;
