"use client";
import Link from 'next/link';
import Button from "../button/button";
import { getSession, signOut } from "../../../lib/auth-client";
import { useEffect, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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
            return setIsLoggedIn(false)
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

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          startTransition(() => {
            setIsLoggedIn(false);
            router.push("/")
          });
        },
      },
    });
  };

  return (
    <header className="header">
      <Link href={"/"}>
        <p className="logo">EXCRP</p>
      </Link>
      <nav className="main-nav">
        <ul>
          <li>
            <Button el="link" href="/">
              Home
            </Button>
          </li>
          {!isLoggedIn && (
            <>
            <li>
              <Button el="link" href="/login">
                Login
              </Button>
            </li>
            <li>
              <Button el="link" href="/signup">
                Signup
              </Button>
            </li>
            </>
            )
            }
            {isLoggedIn && (
              <>
              <li>
                <Button el="link" href={`/${userId}/profile`}>
                  Profile
                </Button>
              </li>
              <li>
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
        </ul>
      </nav>
    </header>
  );
};

export default Header;
