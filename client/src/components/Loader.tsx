import { PageHeader, PageHeaderHeading } from "./page-header";
import { Shell } from "./shells/shell";
import { Skeleton } from "./ui/skeleton";

interface Props {
  heading?: string;
}

export default function Loader({ heading }: Props) {
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
