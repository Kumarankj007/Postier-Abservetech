/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";

export default function ScrollAnim({
  children,
}: {
  children: React.ReactNode;
}) {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // In your case there's only one element to observe:
      if (entries[0].isIntersecting) {
        // Not possible to set it back to false like this:
        setVisible(true);

        // No need to keep observing:
        if (domRef.current) {
          observer.unobserve(domRef.current);
        }
      }
    }, { threshold: 0.02 });

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={(isVisible ? "opacity-100 visible translate-y-0" : " invisible opacity-0 ") + "  duration-500 ease-in-out transition-all"}>
      {children}
    </div>
  );
}
