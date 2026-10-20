import { Burger } from "./burger";

export default function BurgerIcon(props: any) {
  return (
    <Burger
      {...props}
      render={(o: any) => {
        return (
          <>
            <button
              type="button"
              className="hamburger-react transition-transform duration-400 ease-out relative"
              aria-label={o.label || "Toggle menu"}
              aria-expanded={!!o.isToggled}
              aria-pressed={!!o.isToggled}
              aria-controls="mobile-menu"
              data-testid="tilt"
              disabled={props.disabled}
              onClick={props.disabled ? undefined : o.handler}
              onKeyDown={
                props.disabled
                  ? undefined
                  : (e) => (e.key === "Enter" || e.key === " ") && o.handler()
              }
              style={{
                ...o.burgerStyles,
                transform: o.isToggled
                  ? `rotate(${90 * (o.isLeft ? -1 : 1)}deg)`
                  : "none",
              }}
            >
              {/* Bar 1 */}
              <div
                data-testid="bar-one"
                style={{
                  ...o.barStyles,
                  width: `${o.width}px`,
                  top: `${o.topOffset}px`,
                  transition: `${o.time}s ${o.easing}`,
                  transform: o.isToggled
                    ? `rotate(${45 * (o.isLeft ? -1 : 1)}deg) translate(${
                        o.move * (o.isLeft ? -1 : 1)
                      }px, ${o.move}px)`
                    : "none",
                }}
              />

              {/* Bar 2 */}
              <div
                data-testid="bar-two"
                style={{
                  ...o.barStyles,
                  width: `${o.width}px`,
                  top: `${o.topOffset + o.barHeight + o.margin}px`,
                  transition: `${o.time}s ${o.easing}`,
                  transform: o.isToggled ? "scaleX(0)" : "none",
                }}
              />

              {/* Bar 3 */}
              <div
                data-testid="bar-three"
                style={{
                  ...o.barStyles,
                  width: `${o.width}px`,
                  top: `${o.topOffset + o.barHeight * 2 + o.margin * 2}px`,
                  transition: `${o.time}s ${o.easing}`,
                  transform: o.isToggled
                    ? `rotate(${45 * (o.isLeft ? 1 : -1)}deg) translate(${
                        o.move * (o.isLeft ? -1 : 1)
                      }px, ${-1 * o.move}px)`
                    : "none",
                }}
              />
            </button>

            <style jsx>{`
              .hamburger-react {
                cursor: pointer;
                width: 48px;
                height: 48px;
                user-select: none;
                border-radius: 8px;
                transition: background 0.2s ease-in-out;
              }

              .hamburger-react:hover {
                background: rgba(0, 0, 0, 0.05);
              }

              .hamburger-react:focus-visible {
                outline: 2px solid #2563eb;
                outline-offset: 2px;
              }
            `}</style>
          </>
        );
      }}
    />
  );
}
