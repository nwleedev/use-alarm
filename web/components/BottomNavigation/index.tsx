"use client";

import { CalendarDays, CircleUser, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getClassnames(pathname: string, href: string = "/") {
  pathname = pathname.toLowerCase();
  const isActive =
    pathname === href || (href !== "/" && pathname.includes(href));

  if (isActive) {
    return {
      item: "text-sm font-semibold flex flex-col px-2 items-center gap-y-0.5",
      icon: "",
      text: "text-xs font-semibold",
    };
  } else {
    return {
      item: "text-sm font-semibold flex flex-col px-2 items-center gap-y-0.5 text-gray-400",
      icon: "text-gray-400",
      text: "text-xs font-semibold text-gray-400",
    };
  }
}

const BottomNavigation = () => {
  const pathname = usePathname();

  const home = getClassnames(pathname, "/home");
  const calendar = getClassnames(pathname, "/calendar");
  const account = getClassnames(pathname, "/account");
  return (
    <div className="w-full flex items-center justify-around border-t-2 border-b p-2 pt-2.5">
      <Link href={"/home"} className={home.item}>
        <House className={home.icon} />
        <span className={home.text}>Home</span>
      </Link>
      <Link href={"/calendar"} className={calendar.item}>
        <CalendarDays className={calendar.icon} />
        <span className={calendar.text}>Calendar</span>
      </Link>
      <Link href={"/account"} className={account.item}>
        <CircleUser className={account.icon} />
        <span className={account.text}>Account</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
