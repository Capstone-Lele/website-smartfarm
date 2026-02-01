import React from "react";

const DefaultCard = ({
    children,
    className
}:{
    children: React.ReactNode;
    className?: string;
}) => {
  return <div className={`border p-4 min-h-200 h-full rounded-md w-full bg-white ${className}`}>{children}</div>;
};

export default DefaultCard;
