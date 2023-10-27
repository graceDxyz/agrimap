import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  heading?: string;
  variant?: "content" | "auth";
}

export default function LoaderElement({ variant, heading }: Props) {
  if (variant === "content") {
    return <>Loading content...</>;
  }

  if (variant === "auth") {
    return <>Authenticating...</>;
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
