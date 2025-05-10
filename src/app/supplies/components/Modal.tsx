import Loading from "@/app/components/ui/Loading";
import { FaUpload } from "react-icons/fa";
import { X } from "lucide-react";
import React from "react";

export type ModalHandler = {
    title: string,
    message: string,
    confirm: () => void,
    cancel: () => void,
}

export default function UploadModal({modal}: { modal: ModalHandler | null }) {

    if (!modal) return null;

    const { title, message, cancel, confirm } = modal;
    
    if (!title) return null;

    return (
        <div className="z-999 fixed left-0 top-0 h-screen w-screen backdrop-blur-lg flex align-middle items-center">
            <div className="bg-white rounded shadow-md p-8 mx-auto my-20 w-1/4 max-w-125 h-fit max-h-75">
                    <div className="flex items-center gap-5">
                        <div>
                            <h1 className="font-bold text-lg mb-2">{title}</h1>
                            <p>{message}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-5">
                        <button className="bg-gray-100 border border-gray-300 px-6 py-2 rounded text-black hover:bg-gray-200 flex align-middle items-center gap-2" onClick={cancel}>
                            <X className="w-3 h-3" />
                            <span>Cancel</span>
                        </button>
                        <button className="bg-blue-500 px-6 py-2 rounded text-white hover:bg-blue-600" onClick={confirm}>Confirm</button>
                    </div>
            </div>
        </div>
    )
}