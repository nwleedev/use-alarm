import { usePreferences } from "@/hooks/usePreferences";
import { formatAmount } from "@/lib/currency";
import { DateLibs } from "@/lib/date";
import { Subscription } from "@/models/subscription";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const MonthItem = (props: { sub: Subscription<true> }) => {
  const { sub } = props;
  const { currency } = usePreferences();

  return (
    <Link
      href={`/subscription/${sub.id}`}
      key={sub.id}
      className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors rounded-lg group"
    >
      <div className="flex flex-col w-full gap-y-3">
        <div className="flex items-center gap-x-4">
          {sub.icon && (
            <div className="flex justify-center items-center w-10 h-10 bg-[#5030E514] rounded-lg">
              <p className="text-2xl">{sub.icon}</p>
            </div>
          )}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0D062D]">
                {sub.name}
              </h2>
              <span className="font-medium text-[#0D062D] text-lg">
                {DateLibs.formatDate(sub.payment)}
              </span>
            </div>
            {sub.description && (
              <p className="text-sm text-[#787486] line-clamp-1">
                {sub.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3 text-sm">
            <span className="text-[#787486]">
              Reminder: {DateLibs.formatBeforeDays(sub.alarm)} before
            </span>
            <span className="w-1 h-1 bg-[#787486] rounded-full" />
            <span className="font-medium text-[#0D062D]">
              {formatAmount(sub.amount, currency)}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#787486] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
};

const WeekItem = (props: { sub: Subscription<true> }) => {
  const { sub } = props;
  const { currency } = usePreferences();

  return (
    <Link
      href={`/subscription/${sub.id}`}
      key={sub.id}
      className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors rounded-lg group"
    >
      <div className="flex flex-col w-full gap-y-3">
        <div className="flex items-center gap-x-4">
          {sub.icon && (
            <div className="flex justify-center items-center w-10 h-10 bg-[#5030E514] rounded-lg">
              <p className="text-2xl">{sub.icon}</p>
            </div>
          )}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0D062D]">
                {sub.name}
              </h2>
              <span className="font-medium text-[#0D062D] text-lg">
                {DateLibs.formatDay(sub.payment, "EEEE")}
              </span>
            </div>
            {sub.description && (
              <p className="text-sm text-[#787486] line-clamp-1">
                {sub.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3 text-sm">
            <span className="text-[#787486]">
              Reminder: {DateLibs.formatDay(sub.alarm, "EEEE")}
            </span>
            <span className="w-1 h-1 bg-[#787486] rounded-full" />
            <span className="font-medium text-[#0D062D]">
              {formatAmount(sub.amount, currency)}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#787486] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
};

const SubscriptionItem = Object.assign(
  {},
  {
    Week: WeekItem,
    Month: MonthItem,
  }
);

export default SubscriptionItem;
