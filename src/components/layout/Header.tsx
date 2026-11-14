"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import Directory from "@/components/layout/Directory";
import { navLinks } from "@/data/exhibition";
import { startScroll, stopScroll } from "@/lib/lenis";
import { HINT_KEY, openViewfinder } from "@/lib/viewfinder";

/**
 * THE MASTHEAD — a thin register that blends with whatever is behind it.
 * Because it is painted in `difference`, it stays legible over the dark
 * cover, the paper gallery and the photographs without ever changing colour.
 */
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [vfHint, setVfHint] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 80);
  }, []);

  /** Open the viewfinder from anywhere, and retire the first-visit note. */
  const startViewfinder = useCallback(() => {
    setVfHint(false);
    try {
      window.localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* storage unavailable — the note simply returns next session */
    }
    openViewfinder();
  }, []);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(HINT_KEY)) setVfHint(true);
    } catch {
      /* storage unavailable — no invitation */
    }
  }, []);

  useEffect(() => {
    if (!vfHint) return;
    const timer = window.setTimeout(() => setVfHint(false), 12_000);
    return () => window.clearTimeout(timer);
  }, [vfHint]);

  useEffect(() => {
    setMenuOpen(false);
    setDirectoryOpen(false);
    setHidden(false);
  }, [pathname]);

  /* The masthead retreats while reading, returns the moment you scroll back. */
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        last = y;

        if (y < 120) setHidden(false);
        else if (delta > 8) setHidden(true);
        else if (delta < -8) setHidden(false);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (menuOpen || directoryOpen) setHidden(false);
  }, [menuOpen, directoryOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    stopScroll();
    document.documentElement.classList.add("menu-open");
    const timer = window.setTimeout(() => firstMenuLinkRef.current?.focus(), 180);

    return () => {
      window.clearTimeout(timer);
      startScroll();
      document.documentElement.classList.remove("menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu]);

  return (
    <>
      <header
        className="masthead"
        data-hidden={hidden}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="masthead__inner">
          <Link
            className="masthead__brand"
            href="/"
            aria-label="SAUL LEITER — A QUIET GAZE, 返回首页"
          >
            <span className="masthead__brand-name" lang="en">
              Saul Leiter
            </span>
            <span className="masthead__brand-sub" lang="en">
              A Quiet Gaze · 2026
            </span>
          </Link>

          <nav className="masthead__nav" aria-label="主导航">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="masthead__link"
                  aria-current={active ? "page" : undefined}
                >
                  <i aria-hidden="true">{link.index}</i>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="masthead__actions">
            <button
              type="button"
              className="masthead__action masthead__action--vf"
              onClick={startViewfinder}
              data-cursor="link"
              data-cursor-label="FIND"
              aria-label="打开取景器：在展览中收集 16 张照片"
            >
              <span className="masthead__vf-mark" aria-hidden="true">
                ◉
              </span>
              <span className="masthead__vf-word" lang="en">
                VIEWFINDER
              </span>
              <span className="masthead__vf-cn">取景器</span>
            </button>

            <button
              type="button"
              className="masthead__action"
              onClick={() => setDirectoryOpen(true)}
              data-cursor="link"
              data-cursor-label="INDEX"
              aria-haspopup="dialog"
              aria-controls="exhibition-directory"
            >
              <span lang="en">INDEX</span>
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              className="masthead__menu"
              aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? (
                <X aria-hidden="true" strokeWidth={1.5} />
              ) : (
                <Menu aria-hidden="true" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {vfHint ? (
        <button
          type="button"
          className="vf-invite"
          onClick={startViewfinder}
          data-cursor="link"
          data-cursor-label="FIND"
        >
          <span className="vf-invite__dot" aria-hidden="true" />
          <span>
            收集 <b>16</b> 张照片
          </span>
          <span className="vf-invite__cta" lang="en">
            OPEN VIEWFINDER →
          </span>
        </button>
      ) : null}

      <Directory open={directoryOpen} onClose={() => setDirectoryOpen(false)} />

      <div
        id="mobile-menu"
        className="mobile-menu"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <p className="mobile-menu__label" lang="en">
          INDEX / 2026 — AN INDEPENDENT EXHIBITION
        </p>

        <nav className="mobile-menu__list" aria-label="移动端导航">
          <Link
            href="/"
            ref={firstMenuLinkRef}
            className="mobile-menu__link"
            onClick={closeMenu}
            aria-current={pathname === "/" ? "page" : undefined}
            lang="en"
          >
            <i>00</i>
            <span>Home</span>
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-menu__link"
              onClick={closeMenu}
              aria-current={pathname === link.href ? "page" : undefined}
              lang="en"
            >
              <i>{link.index}</i>
              <span>
                {link.label
                  .replace("THE ", "")
                  .replace(/^./, (char) => char.toUpperCase())}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mobile-menu__foot">
          <span>SAUL LEITER · 1923—2013</span>
          <span>NEW YORK / ONLINE</span>
        </div>
      </div>
    </>
  );
}
