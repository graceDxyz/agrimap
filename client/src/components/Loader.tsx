import image from "@/assets/agrimap.png";
import { PageHeader, PageHeaderHeading } from "./page-header";
import { Shell } from "./shells/shell";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface Props {
  heading?: string;
  type?: "default" | "signin";
}

export default function Loader({ type, heading }: Props) {
  if (type === "default") {
    return <>Loading content...</>;
  }
  if (type === "signin") {
    return (
      <Shell>
        <div className="container min-h-screen flex justify-center items-center">
          <Card className="py-10">
            <CardContent className="grid gap-4">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex justify-center">
                  <div>
                    <img className="h-32" src={image} alt="logo" />
                  </div>
                </div>
                <span className="w-full border-t" />
              </div>
              <Skeleton className="h-[217px]" />
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex justify-between space-x-4">
          {heading ? (
            <PageHeaderHeading size="sm" className="flex-1">
              {heading}
            </PageHeaderHeading>
          ) : (
            <Skeleton className="w-60 h-10" />
          )}
          <Skeleton className="w-32 h-10" />
        </div>
        <Skeleton className="w-96 h-4" />
      </PageHeader>
      <Skeleton className="w-full h-[calc(100vh-30vh)]" />
    </Shell>
  );
}
