"use client";

import { useState, useRef, useId, useEffect } from "react";
import Button from "../button/button";
import "./dropdown.css";

type DropdownProps = {
  options?: string[];
  children?: React.ReactNode;
  label?: string;
  onClickHandler?: (e: React.MouseEvent) => void;
  onKeyHandler?: (e: React.KeyboardEvent) => void;
  startOpen?: boolean;
  forceClose?: boolean;
  externallySetActiveValue?: string;
};

const Dropdown = ({
  options,
  children,
  label,
  onClickHandler,
  onKeyHandler,
  startOpen,
  forceClose,
  externallySetActiveValue,
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
        if (!forceClose) {
          menu.classList.remove("open");
          setTimeout(() => setOpen(false), 300);
        }
      } else {
        menu.classList.add("open");
      }
    }
  };

  const handleMenuClick = () => {
    const menu =
      menuRef && menuRef.current ? (menuRef.current as HTMLElement) : null;

    if (!open) {
      setOpen(true);
      if (menu) {
        menu.classList.add("open");
      }
      // set focus on open
      setTimeout(() => {
        if (firstItemRef.current && menuRef.current) {
          let elToFocus: HTMLLIElement;
          const existingActive = (
            menuRef?.current as HTMLElement
          ).querySelector(".active") as HTMLLIElement;
          if (existingActive) {
            elToFocus = existingActive;
          } else {
            elToFocus = firstItemRef.current;
          }
          elToFocus.focus();
        }
      }, 0);
    } else {
      setTimeout(() => setOpen(false), 300);
    }
  };

  useEffect(() => {
    const toggleChildVisibility = (menu: HTMLElement) => {
      if (menu) {
        menu.querySelectorAll("li").forEach((el) => {
          const hasNested = el.children.length;
          if (hasNested) {
            if (el.children[0].matches('button, a')) {
              return (el.children[0] as HTMLElement)?.setAttribute(
                "tabindex",
                open ? "0" : "-1",
              );
            }             
          } else {
            return el.setAttribute(
              "tabindex",
              open ? "0" : "-1",
            );
          }
        });
      }
    };
    if (menuRef.current) {
      toggleChildVisibility(menuRef.current);
    }
  }, [open]);

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
        role="list"
        onClick={toggleOpenClass}
      >
        {options && options.length > 0 && (
          <li
            className={`dropdown-item  ${externallySetActiveValue === options[0] ? "active" : ""}`}
            ref={firstItemRef}
            key={options[0]}
            data-value={options[0]}
            onClick={onClickHandler}
            onKeyDown={onKeyHandler}
          >
            {options[0]}
          </li>
        )}
        {options &&
          options.length > 1 &&
          Array.isArray(options) &&
          options.slice(1).map((option: string) => (
            <li
              className={`dropdown-item  ${externallySetActiveValue === option ? "active" : ""}`}
              key={option}
              data-value={option}
              onClick={onClickHandler}
              onKeyDown={onKeyHandler}
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
