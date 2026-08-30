import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const LINKS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/visualize', label: 'Visualizer' },
  { to: '/compare', label: 'Compare' },
  { to: '/learn', label: 'Learn' },
];

/**
 * Floating liquid-glass navbar. Desktop shows a centred glass pill of links.
 * Mobile uses a tap-to-open menu (a horizontal scroll strip is fiddly on real
 * phones), so every link is always one tap away. Dark-only, no theme switch.
 *
 * The bar is fixed, so the page scrolls underneath it and its surfaces are
 * backed (`.liquid-glass-solid`) rather than left at the 1%-white glass the
 * rest of the site uses over static backdrops — otherwise whatever is behind
 * reads straight through the controls.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the menu on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3">
        <Link
          to="/"
          aria-label="VisSort home"
          className="liquid-glass liquid-glass-solid grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-2xl italic leading-none text-primary"
        >
          V
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="liquid-glass liquid-glass-solid hidden items-center rounded-full p-1.5 md:flex"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-fast ${
                  isActive ? 'bg-accent text-on-accent' : 'text-primary/90 hover:text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/visualize"
            className="ml-1.5 whitespace-nowrap rounded-full bg-lime px-4 py-2 text-sm font-semibold text-on-lime transition-transform duration-fast active:scale-95"
          >
            Start sorting
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="liquid-glass liquid-glass-solid grid h-12 w-12 shrink-0 place-items-center rounded-full text-primary md:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        {/* Desktop spacer keeps the pill optically centred. */}
        <div className="hidden h-12 w-12 shrink-0 md:block" aria-hidden="true" />
      </div>

      {/* Mobile dropdown: full list, each row a real 48px touch target. */}
      {open && (
        <nav
          aria-label="Primary mobile"
          className="liquid-glass liquid-glass-solid rise-in mt-2 flex flex-col gap-1 rounded-[1.5rem] p-2 md:hidden"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex min-h-[48px] items-center rounded-2xl px-4 text-base font-medium transition-colors duration-fast ${
                  isActive ? 'bg-accent text-on-accent' : 'text-primary/90 active:bg-accent-soft'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/visualize"
            onClick={() => setOpen(false)}
            className="mt-1 flex min-h-[48px] items-center justify-center rounded-2xl bg-lime px-4 text-base font-semibold text-on-lime"
          >
            Start sorting
          </Link>
        </nav>
      )}
    </header>
  );
}
