"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { navLinks } from "@/data/exhibition";
import { startScroll, stopScroll } from "@/lib/lenis";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => toggleRef.current?.focus(), 80);
  }, []);

  const isHome = pathname === "/";
  const isOverlay = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const backgroundRegions = Array.from(
      document.querySelectorAll<HTMLElement>("main, .site-footer")
    );

    if (open) {
      stopScroll();
      document.documentElement.classList.add("menu-open");
      backgroundRegions.forEach((region) => region.setAttribute("inert", ""));
      window.setTimeout(() => firstLinkRef.current?.focus(), 120);
    } else {
      startScroll();
      document.documentElement.classList.remove("menu-open");
      backgroundRegions.forEach((region) => region.removeAttribute("inert"));
    }

    return () => {
      startScroll();
      document.documentElement.classList.remove("menu-open");
      backgroundRegions.forEach((region) => region.removeAttribute("inert"));
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [closeMenu]);

  return (
    <>
      <header
        className={[
          "site-header",
          isOverlay ? "is-overlay" : "",
          scrolled ? "is-solid" : "",
          open ? "is-menu-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        inert={open ? true : undefined}
      >
        <div className="site-header__inner">
          <Link
            href="/"
            className="brand"
            aria-label="SAUL LEITER — A QUIET GAZE, 返回首页"
          >
            <span className="brand__name" lang="en">
              SAUL LEITER
            </span>
            <span className="brand__sub" lang="en">
              A Quiet Gaze
            </span>
          </Link>

          <nav className="nav" aria-label="主导航">
            <ul className="nav__list">
              {navLinks.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="nav__link"
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="nav__index" aria-hidden="true">
                        {link.index}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-meta">
            <span className="header-meta__item">2026 EDITION</span>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "关闭菜单" : "打开菜单"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X aria-hidden="true" strokeWidth={1.5} />
              ) : (
                <Menu aria-hidden="true" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        className="menu-overlay"
        data-open={open}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="menu-overlay__bar">
          <Link
            href="/"
            className="menu-overlay__brand"
            onClick={closeMenu}
            aria-label="SAUL LEITER — A QUIET GAZE, 返回首页"
          >
            <span lang="en">SAUL LEITER</span>
            <span className="menu-overlay__brand-sub">A QUIET GAZE</span>
          </Link>

          <button
            type="button"
            className="menu-overlay__close"
            aria-label="关闭菜单"
            onClick={closeMenu}
          >
            <X aria-hidden="true" strokeWidth={1.5} />
          </button>
        </div>

        <nav aria-label="移动端导航">
          <p className="meta" style={{ color: "rgba(234,230,222,.45)" }}>
            INDEX / 2026
          </p>
          <ul className="menu-overlay__list">
            <li>
              <Link
                href="/"
                ref={firstLinkRef}
                className="menu-overlay__link"
                aria-current={pathname === "/" ? "page" : undefined}
                onClick={closeMenu}
              >
                <span className="menu-overlay__index">00</span>
                <span lang="en">Home</span>
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="menu-overlay__link"
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={closeMenu}
                >
                  <span className="menu-overlay__index">{link.index}</span>
                  <span lang="en">
                    {link.label
                      .replace("THE ", "")
                      .replace(/^./, (char) => char.toUpperCase())}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-overlay__foot">
          <span>SAUL LEITER · 1923—2013</span>
          <span>AN INDEPENDENT EDITORIAL EXHIBITION</span>
        </div>
      </div>
    </>
  );
}
