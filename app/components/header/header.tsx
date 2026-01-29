"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import Button from "../button/button";
import Container from "../container/container";
import Dropdown from "../dropdown/dropdown";
import { availableThemes } from "@/lib/constants";
import { useSession, signOut } from "../../../lib/auth-client";
import React from "react";
import { useRouter } from "next/navigation";
import { isAvailableTheme } from "../../../lib/constants";
import "./header.css";

interface HeaderProps {
  initialSession: { user: { id: string } | null; session: unknown } | null;
}

const Header = ({ initialSession }: HeaderProps) => {
  // Use useSession for real-time updates, but initialize with server session to avoid flash
  const { data: session } = useSession();
  const displaySession = session || initialSession;

  const router = useRouter();
  const { setTheme } = useTheme();

  const isLoggedIn = !!displaySession?.user;
  const userId = displaySession?.user?.id ?? null;

  const handleOnClick = (e: React.MouseEvent) => {
    const selected = (e.target as HTMLLIElement)?.getAttribute("data-value");
    if (selected && isAvailableTheme(selected)) {
      setTheme(selected);
    }
  };

  const handleOnKey = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    const selected = (e.target as HTMLLIElement)?.getAttribute("data-value");
    if (selected && isAvailableTheme(selected)) {
      setTheme(selected);
    }
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <Container classes="header-container">
      <header className="header">
        <Link href={"/"}>
          <p className="logo">EXCRP</p>
        </Link>
        <nav className="main-nav">
          <ul className="main-nav--list desktop">
            <li className="main-nav--item">
              <Button el="link" href="/">
                Home
              </Button>
            </li>
            {!isLoggedIn && (
              <>
                <li className="main-nav--item">
                  <Button el="link" href="/login">
                    Login
                  </Button>
                </li>
                <li className="main-nav--item">
                  <Button el="link" href="/signup">
                    Signup
                  </Button>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li className="main-nav--item">
                  <Button el="link" href={`/${userId}/profile`}>
                    Profile
                  </Button>
                </li>
                <li className="main-nav--item">
                  <Button
                    el="button"
                    as="link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                  >
                    Log Out
                  </Button>
                </li>
              </>
            )}
            <li className="main-nav--item">
              <Button el="link" href={`/about`}>
                About
              </Button>
            </li>
            <li className="main-nav--dropdown">
              <Dropdown
                label="Theme"
                options={[...availableThemes]}
                onClickHandler={(e: React.MouseEvent) => {
                  handleOnClick(e);
                }}
                onKeyHandler={(e: React.KeyboardEvent) => {
                  handleOnKey(e);
                }}
              />
            </li>
          </ul>
          <ul className="main-nav--list mobile">
            <Dropdown label="Menu">
              <li className="main-nav--item">
                <Button el="link" href="/">
                  Home
                </Button>
              </li>
              {!isLoggedIn && (
                <>
                  <li className="main-nav--item">
                    <Button el="link" href="/login">
                      Login
                    </Button>
                  </li>
                  <li className="main-nav--item">
                    <Button el="link" href="/signup">
                      Signup
                    </Button>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <>
                  <li className="main-nav--item">
                    <Button el="link" href={`/${userId}/profile`}>
                      Profile
                    </Button>
                  </li>
                  <li className="main-nav--item">
                    <Button
                      el="button"
                      as="link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSignOut();
                      }}
                    >
                      Log Out
                    </Button>
                  </li>
                </>
              )}
              <li className="main-nav--item">
                <Button el="link" href={`/about`}>
                  About
                </Button>
              </li>
              <li className="main-nav--dropdown">
                <Dropdown
                  label="Theme"
                  options={[...availableThemes]}
                  startOpen={true}
                  onClickHandler={(e: React.MouseEvent) => {
                    handleOnClick(e);
                  }}
                  onKeyHandler={(e: React.KeyboardEvent) => {
                    handleOnKey(e);
                  }}
                />
              </li>
            </Dropdown>
          </ul>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
