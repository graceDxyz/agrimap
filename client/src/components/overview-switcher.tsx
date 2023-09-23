import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Command, CommandItem, CommandList } from "./ui/command";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

const overviewFilter = [
  {
    label: "Annually",
    value: "1",
  },
  {
    label: "Monthly",
    value: "2",
  },
  {
    label: "Weekly",
    value: "3",
  },
];

type Overview = {
  label: string;
  value: string;
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface OverviewSwitcherProps extends PopoverTriggerProps {}

export default function OverviewSwitcher({ className }: OverviewSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewOverviewDialog, setShowNewOverviewDialog] =
    React.useState(false);
  const [selectedOverview, setSelectedOverview] = React.useState<Overview>(
    overviewFilter[1],
  );

  return (
    <Dialog
      open={showNewOverviewDialog}
      onOpenChange={setShowNewOverviewDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a overview"
            className={cn("w-[120px] justify-between", className)}
          >
            {selectedOverview.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[120px] p-0">
          <Command>
            <CommandList>
              {overviewFilter.map((filter) => (
                <CommandItem
                  key={filter.value}
                  onSelect={() => {
                    setSelectedOverview(filter);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  {filter.label}
                  <Icons.check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOverview.value === filter.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
