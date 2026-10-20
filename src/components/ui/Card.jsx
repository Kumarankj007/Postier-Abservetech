import React from "react";
import useSkin from "@/hooks/useSkin";
import Icon from "@/components/ui/Icon.jsx";
import { useNavigate } from "react-router-dom";

const Card = ({
  children,
  title,
  subtitle,
  headerslot,
  className = "custom-class",
  bodyClass = "p-6",
  noborder,
  footer,
  backIcon = false,
  titleClass = "custom-class",
}) => {
  const [skin] = useSkin();
  const navigate = useNavigate();
  return (
    <div
      className={`
        card rounded-md bg-white dark:bg-slate-800  p-0 ${skin === "bordered"
          ? " border border-slate-200 dark:border-slate-700"
          : "shadow-base"
        }
   
    ${className}
        `}
    >
      {(title || subtitle) && (
        <header
          className={`card-header ${noborder ? "no-border" : ""} p-6 min-h-[95px]`}
        >
          <div className="flex items-center">
            {backIcon && (
              <div className="cursor-pointer" onClick={() => navigate(-1)}>
                <Icon
                  icon="heroicons-outline:arrow-sm-left"
                  className="w-[30px] h-[30px] mr-4"
                />
              </div>
            )}
            {title && <div className={`card-title ${titleClass}`}>{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {headerslot && <div className="card-header-slot">{headerslot}</div>}
        </header>
      )}
      <main className={`card-body ${bodyClass}`}>{children}</main>
      {footer && <footer className="card-footer mt-[50px]">{footer}</footer>}
      {/* <footer className="card-footer">{footer}</footer> */}
    </div>
  );
};

export default Card;
