import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Loading from "../../_components/loading";
import { Button } from "@/components/ui/button";

export function ConfirmOrderModal({ open, setOpen, onSubmit, isLoading }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit : ()=>Promise<void>
    isLoading:boolean
}) {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                {(isLoading) &&
                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <Loading />
                    </div>}
                <DialogHeader>
                    <DialogTitle>Confirm Delivery </DialogTitle>
                    <DialogDescription>
                    Confirm the delivery completion.
                    </DialogDescription>
                </DialogHeader>
                <div className=" flex flex-row gap-2 w-full">
                <Button disabled={isLoading} onClick={() => setOpen(false)} variant={"outline"} className=" flex-1">Cancel</Button>
                <Button disabled={isLoading} onClick={() => onSubmit()} className=" flex-1">Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
