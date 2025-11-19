"use client";

import Button from "../button/button"
import { getSession, signOut } from "../../../lib/auth-client";
import { useEffect, useState, startTransition } from "react";
import { usePathname } from "next/navigation";
import { link } from "fs";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await getSession();
        if (!mounted) return;
        startTransition(() => {
          setIsLoggedIn(Boolean(data?.session && data?.user));
        });
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
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          startTransition(() => {
            setIsLoggedIn(false);
          });
        },
      },
    });
  };

  return (
    <header>
      <p>isLoggedIn: {isLoggedIn ? "true" : "false"}</p>
      <nav>
        <ul>
          <li>
            <Button el="link" href="/">Home</Button>
          </li>
          <li>
            {!isLoggedIn && <Button el="link" href="/login">Login</Button>}
            {isLoggedIn && (
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
            )}
          </li>
          <li>
            <Button el="link" href="/signup">Signup</Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;