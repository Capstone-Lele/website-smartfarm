import React from 'react'
import { LuExternalLink } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import Link from 'next/link'

const ButtonRedirectColumn = ({
  href,
  onClick,
}: {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href || "#"}
          onClick={onClick}
          className="h-9 w-9 p-0 cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md"
        >
          <LuExternalLink size={20} />
        </Link>
      </TooltipTrigger>
      <TooltipContent>Lihat Detail</TooltipContent>
    </Tooltip>
  );
}

export default ButtonRedirectColumn