import { DateLibs } from "@/lib/date";
import { Subscription } from "@/models/subscription";
import Link from "next/link";

const MonthItem = (props: { sub: Subscription<true> }) => {
  const { sub } = props;
  return (
    <Link
      href={`/subscription/${sub.id}`}
      key={sub.id}
      className="flex items-center px-2 py-4 gap-x-2"
    >
      <div className="flex flex-col w-full gap-y-2">
        <div className="flex gap-x-4">
          {sub.icon && (
            <div className="flex justify-center items-center">
              <p className="text-2xl">{sub.icon}</p>
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{sub.name}</h2>
            <p className="text-gray-500 font-normal">{sub.description}</p>
          </div>
        </div>
        <div className="w-full flex items-center text-sm text-gray-600 divide-x-2 gap-x-2">
          <span className="">
            Alarm before {DateLibs.formatBeforeDays(sub.alarm)}
          </span>
          <span className="px-2">₩{sub.amount.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-semibold text-xl">
          {DateLibs.formatDate(sub.payment)}
        </span>
      </div>
    </Link>
  );
};

const WeekItem = (props: { sub: Subscription<true> }) => {
  const { sub } = props;
  return (
    <Link
      href={`/subscription/${sub.id}`}
      key={sub.id}
      className="flex items-center px-2 py-4 gap-x-2"
    >
      <div className="flex flex-col w-full gap-y-2">
        <div className="flex gap-x-4">
          {sub.icon && (
            <div className="flex justify-center items-center">
              <p className="text-2xl">{sub.icon}</p>
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{sub.name}</h2>
            <p className="text-gray-500 font-normal">{sub.description}</p>
          </div>
        </div>
        <div className="w-full flex items-center text-sm text-gray-600 divide-x-2 gap-x-2">
          <span className="">Payment on {DateLibs.formatDay(sub.payment)}</span>
          <span className="px-2">₩{sub.amount.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-semibold text-xl">
          {DateLibs.formatDay(sub.alarm)}
        </span>
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
