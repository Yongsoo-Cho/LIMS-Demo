import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";

type DiscardWarningModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onDiscard: () => void;
};

export default function DiscardWarningModal({
  isOpen,
  onCancel,
  onDiscard,
}: DiscardWarningModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onCancel} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 transition-opacity" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-md space-y-4 border bg-white p-8 rounded-xl shadow-xl">
            <DialogTitle className="text-lg font-bold">
              Discard Draft?
            </DialogTitle>
            <p className="text-sm text-gray-600">
              You have unsaved progress. Are you sure you want to discard it?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              >
                Keep Editing
              </button>
              <button
                onClick={onDiscard}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Discard Draft
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
