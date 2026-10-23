import React from "react";

interface ComponentTransitionProps {
  children: React.ReactNode;
  slug: string;
}

export const ComponentTransition: React.FC<ComponentTransitionProps> = ({
  children,
  slug,
}) => {
  return (
    <div
      key={slug}
      className="flex-1 min-w-0 flex flex-col gap-3 sm:gap-3.5"
    >
      {children}
    </div>
  );
};
