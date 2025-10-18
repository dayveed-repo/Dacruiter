import React from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

const Logo = ({ pathname = "/" }: { pathname?: string }) => {
  return (
    <Link href={pathname} className={`${pacifico.className} logo text-[2rem]`}>
      Danq
    </Link>
  );
};

export default Logo;
