import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { useGetDisbursementReport } from "@/services/report.service";
import { subYears } from "date-fns";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

function DisbursementReport() {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const [userName, setUserName] = useState<string>("");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subYears(new Date(), 1),
    to: new Date(),
  });

  const { mutate, isLoading: isDownloadLoading } = useGetDisbursementReport();

  useEffect(() => {
    if (open && user) {
      setUserName(user?.firstname + " " + user?.lastname);
    }
  }, [open, user]);

  function handleSubmit() {
    setOpen(false);
    mutate({ userName, date });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={isDownloadLoading}>
          <Button
            size="sm"
            variant="secondary"
            disabled={isDownloadLoading}
            onClick={() => setOpen(true)}
          >
            {isDownloadLoading ? (
              <Icons.spinner className="h-6 w-6 animate-spin" />
            ) : (
              <Icons.fileDownload className="h-6 w-6" />
            )}
            <span className="pl-2">Download</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Download Disbursement Report</DialogTitle>
            <DialogDescription>
              Select a date range to download the disbursement report. Click
              download when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col px-10 gap-5">
            <div className="">
              <label>Name</label>
              <Input
                placeholder="Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="w-full flex justify-center flex-col">
              <label>Date</label>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.to}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSubmit}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DisbursementReport;
