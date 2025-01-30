import { Fragment } from "react";
import {
  DialogPanel,
  Dialog as Modal,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { DialogTitle, ModalClose } from "@mui/joy";

interface SharedModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: number;
}

export default function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
}: SharedModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Modal as="div" className="relative z-[1001]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <DialogPanel
              className={`transform rounded-lg bg-whitefull shadow-xl transition-all max-h-[90vh] overflow-y-auto`}
            >
              <ModalClose onClick={onClose} />
              {title && (
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {title}
                  </DialogTitle>
                </div>
              )}

              <div className="px-4 py-2">{children}</div>

              {actions && (
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {actions}
                </div>
              )}
            </DialogPanel>
          </Transition.Child>
        </div>
      </Modal>
    </Transition>
  );
}
