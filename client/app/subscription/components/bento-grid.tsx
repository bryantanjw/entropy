import { cn } from "@/lib/utils";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};

export function SubscriptionGrid() {
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div
            className={cn(
              "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] bg-white border justify-between flex flex-col space-y-2"
            )}
          >
            <CardHeader className="items-center gap-3 px-4 pt-5">
              <CardTitle>Plan summary</CardTitle>
              <Badge variant="secondary" className="w-fit rounded-xl">
                Free Plan
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-12 text-sm items-center px-4 pb-5">
              <div className="col-span-2 flex flex-col gap-2">
                <div className="font-light text-xs">
                  <span className="font-semibold text-sm">200 </span>
                  <span className="opacity-70">credits left</span>
                </div>
                <Progress className="w-full" value={50} />
              </div>

              <div className="col-span-2 flex gap-10 items-center">
                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Price/Month</span>
                  <span className="font-semibold">$0</span>
                </div>

                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Included Credits</span>
                  <span className="font-semibold">$0</span>
                </div>

                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Renewal Date</span>
                  <span className="font-semibold">$0</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end bg-muted rounded-b-xl py-3 px-4 border-t">
              <Button variant="outline" className="bg-background">
                Upgrade
              </Button>
            </CardFooter>
          </div>

          <div
            className={cn(
              "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border justify-between flex flex-col space-y-2"
            )}
          >
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardContent>
              <div>No payment method added.</div>
            </CardContent>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You can refer to all your past invoices in the Vercel website,
                under Invoices.
              </p>
            </CardContent>
            <CardFooter>
              <Link className="text-blue-600 hover:underline" href="#">
                Go to the Invoices page
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div
          className={cn(
            "col-span-1",
            "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border justify-between flex flex-col space-y-4"
          )}
        >
          <CardHeader>
            <CardTitle>On-Demand Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You cannot buy on-demand credits without an active subscription.
              Please resume your subscription or choose a new plan.
            </p>
            <Select>
              <SelectTrigger id="credits">
                <SelectValue placeholder="Select credits" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="50">50 Credits</SelectItem>
                <SelectItem value="100">100 Credits</SelectItem>
                <SelectItem value="200">200 Credits</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-6">
              <div className="text-lg font-medium">Credits Balance Summary</div>
              <div className="mt-2">
                <div className="flex justify-between">
                  <span>Current Credits Balance</span>
                </div>
                <div className="font-bold">200</div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <span>On-Demand Credits</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <span>New Credits Balance After Purchase</span>
                </div>
                <div className="font-bold">200</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Purchase Credits</Button>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}

export function SubscriptionBentoGrid() {
  return (
    <BentoGrid className="md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);
const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    className: "md:col-span-2",
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    className: "md:col-span-1",
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    className: "md:col-span-1",
  },
  {
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <Skeleton />,
    className: "md:col-span-2",
  },
];
