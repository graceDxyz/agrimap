import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBoundStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import * as React from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface OverviewSwitcherProps extends PopoverTriggerProps {
  isLoading?: boolean;
}

export default function OverviewSwitcher({
  className,
  isLoading,
}: OverviewSwitcherProps) {
  const { options, activeSwitcher, setSwitcherValue } = useBoundStore(
    (state) => state.overview,
  );
  const [open, setOpen] = React.useState(false);
  const [showNewOverviewDialog, setShowNewOverviewDialog] =
    React.useState(false);

  return (
    <Dialog
      open={showNewOverviewDialog}
      onOpenChange={setShowNewOverviewDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={isLoading}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a overview"
            className={cn("w-[120px] justify-between", className)}
          >
            {activeSwitcher.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[120px] p-0">
          <Command>
            <CommandList>
              {options.map((filter) => (
                <CommandItem
                  key={filter.value}
                  onSelect={() => {
                    setSwitcherValue(filter);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  {filter.label}
                  <Icons.check
                    className={cn(
                      "ml-auto h-4 w-4",
                      activeSwitcher.value === filter.value
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
