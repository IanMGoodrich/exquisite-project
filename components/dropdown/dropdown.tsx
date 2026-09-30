"use client";

import { useState, useRef, useId, useEffect } from "react";
import Button from "../button/button";
import "./dropdown.css";

export type PositionAbsoluteOptions = "none" | "mobile" | "desktop" | "both";

type DropdownProps = {
  options?: string[];
  children?: React.ReactNode;
  label?: string;
  onClickHandler?: (e: React.MouseEvent) => void;
  onKeyHandler?: (e: React.KeyboardEvent) => void;
  startOpen?: boolean;
  forceClose?: boolean;
  externallySetActiveValue?: string;
  //Set optional absolute position styles
  absolute?: PositionAbsoluteOptions;
  //If is nested inside other dropdown pass true to prevent clickhandler from closing parent menu.
  hasNested?: boolean;
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
  absolute,
  hasNested,
}: DropdownProps) => {
  const buttonId = useId();
  const firstItemRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(startOpen);
  const absolutePosition = !absolute ? "both" : absolute;
  
  const toggleAttributes = (el: HTMLElement) => {
    if (open) {
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-hidden", "false");
    } else {
      el.setAttribute("tabindex", "-1");
      el.setAttribute("aria-hidden", "true");
    }
    return el;
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
            if (el.children[0].matches("button, a")) {
              toggleAttributes(el.children[0] as HTMLElement);
            }
          } else {
            toggleAttributes(el);
          }
        });
      }
    };
    if (menuRef.current) {
      toggleChildVisibility(menuRef.current);
    }

    const closeOnOtherMenuOpen = (e: MouseEvent) => {
      const isTrigger = (e.target as HTMLElement).classList.contains(
        "dropdown-trigger",
      );

      if (isTrigger) {
        const triggerID = (e.target as HTMLElement).getAttribute(
          "data-button-id",
        );

        if (triggerID !== buttonId) {
          return setOpen(false);
        }
      }
    };

    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEsc);
    if(!hasNested) {
      window.addEventListener("click", closeOnOtherMenuOpen);
    }

    return () => {
      window.removeEventListener("keydown", closeOnEsc);
      if(!hasNested) {
        window.removeEventListener("click", closeOnOtherMenuOpen);
      }
    };
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
        className={`dropdown-list ${open ? "open" : "closed"} ${absolutePosition}`}
        role="list"
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
