import { format } from "date-fns";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface Props {
  date: DateRange | undefined;
  onSelect: (newDate: DateRange | undefined) => void; // Add onSelect prop
}

export function CalendarDateRangePicker({ date, onSelect }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Icons.calendar className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
