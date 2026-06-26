"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import Button from "../button/button";
import Container from "../container/container";
import Dropdown from "../dropdown/dropdown";
import Image from "../image/image";
import Modal from "../modal/modal";
import { availableThemes } from "@/lib/constants";
import { useSession, signOut } from "@/lib/auth-client";
import React from "react";
import { useState, useEffect, type FC } from "react";
import { useRouter } from "next/navigation";
import { isAvailableTheme } from "@/lib/constants";
import "./header.css";
import { usePathname } from "next/navigation";
interface HeaderProps {
  initialSession: { user: { id: string } | null; session: unknown } | null;
}

const Header: FC<HeaderProps> = ({ initialSession }) => {
  // Use useSession for real-time updates, but initialize with server session to avoid flash
  const { data: session } = useSession();
  const displaySession = session || initialSession;
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pathOfInspiration, setPathOfInspiration] = useState(false);
  const pathName = usePathname();
  const [inspirationUrl, setInspirationUrl] = useState("");
  const [inspirationModalOpen, setInspirationModalOpen] = useState(false);

  useEffect(() => {
    const regexForCreateUpdate =
      /^\/[A-Za-z0-9]+\/stories\/(?:create|[A-Za-z0-9-]+\/update)$/;
    const checkPath = (pathName: string) => {
      setPathOfInspiration(regexForCreateUpdate.test(pathName));
    };
    // Use async hydration check pattern to avoid linter and React 'cascading renders' errors
    // and prevent server/client data misalignment.

    const hydrate = async () => {
      await new Promise((resolve) => resolve(null));
      checkPath(pathName);
      setMounted(true);
    };
    hydrate();
  }, [pathName]);

  const isLoggedIn = !!displaySession?.user;
  const userId = displaySession?.user?.id ?? null;

  const handleInspirationClick = async () => {
    const ImageUrl = await fetch("/api/images/presigned-url/get", {
      method: "GET",
    });

    if (ImageUrl.ok) {
      const url = await ImageUrl.json();
      setInspirationUrl(url.url);
    }
  };

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
            {pathOfInspiration && (
              <li className="main-nav--item">
                <Button el="button" as="link" onClick={handleInspirationClick}>
                  Inspiration
                </Button>
              </li>
            )}
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
                options={availableThemes as unknown as string[]}
                externallySetActiveValue={mounted ? theme : "default"}
                onClickHandler={(e: React.MouseEvent) => {
                  handleOnClick(e);
                }}
                onKeyHandler={(e: React.KeyboardEvent) => {
                  handleOnKey(e);
                }}
              />
            </li>
          </ul>
          <div className="mobile-nav-wrapper">
            <Dropdown label="Menu">
              <ul className="main-nav--list mobile">
                {pathOfInspiration && (
                  <li className="main-nav--item">
                    <Button
                      el="button"
                      as="link"
                      onClick={handleInspirationClick}
                    >
                      Inspiration
                    </Button>
                  </li>
                )}
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
                    options={availableThemes as unknown as string[]}
                    startOpen={false}
                    externallySetActiveValue={mounted ? theme : "default"}
                    onClickHandler={(e: React.MouseEvent) => {
                      handleOnClick(e);
                    }}
                    onKeyHandler={(e: React.KeyboardEvent) => {
                      handleOnKey(e);
                    }}
                  />
                </li>
              </ul>
            </Dropdown>
          </div>
        </nav>
      </header>
      {inspirationUrl && inspirationUrl !== "" && (
        <Modal 
          variant="inspiration"
          onClose={() => setInspirationUrl("")}
        >
          <Image
            className="header--inspiration-image"
            src={inspirationUrl}
            alt=""
            variant="display"
            width={600}
            height={600}
          />
          <Button el="button" onClick={handleInspirationClick}>
            Get another image
          </Button>
        </Modal>
      )}
    </Container>
  );
};

export default Header;
