import { useBoundStore } from "@/lib/store";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

export default function DialogContainer() {
  const { item, setDialogItem } = useBoundStore((state) => state.dialog);
  const isOpen = Boolean(item);

  function onOpenChange() {
    setDialogItem(undefined);
  }

  if (!item) {
    return;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{item.title}</AlertDialogTitle>
          <AlertDialogDescription>{item.description} </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <div>{item.form}</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
