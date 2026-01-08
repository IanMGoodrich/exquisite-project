"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import Button from "../button/button";
import Container from "../container/container";
import Dropdown from "../dropdown/dropdown";
import { availableThemes } from "@/lib/constants";
import { getSession, signOut } from "../../../lib/auth-client";
import React, { useEffect, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAvailableTheme } from "../../../lib/constants";
import "./header.css";
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await getSession();
        if (!mounted) return;

        if (data?.session && data?.user) {
          startTransition(() => {
            setIsLoggedIn(Boolean(data.session && data.user));
            setUserId(data.user.id);
          });
        } else {
          startTransition(() => {
            return setIsLoggedIn(false);
          });
        }
      } catch (error) {
        console.error("session check failed", error);
        if (!mounted) return;
        startTransition(() => {
          setIsLoggedIn(false);
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pathname, isLoggedIn]);

  const handleOnClick = (e: React.MouseEvent) => {
    const selected = (e.target as HTMLLIElement)?.getAttribute("data-value");
    console.log("header clickhandler", e.target, selected);
    if (selected && isAvailableTheme(selected)) {
      setTheme(selected);
    }
  };

  const handleOnKey = (e: React.KeyboardEvent) => {
    console.log();
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
          startTransition(() => {
            setIsLoggedIn(false);
            router.push("/");
          });
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
