import { useUiStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmModal() {
  const open = useUiStore((s) => s.confirmOpen);
  const close = useUiStore((s) => s.closeConfirm);
  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm booking</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to place the booking?</p>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
