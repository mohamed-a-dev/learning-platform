import { toast, Id } from "react-toastify";

const displaySuccess = (msg: string, id: Id) => {

    if (!msg) return;

    const formattedMsg = msg.trim().charAt(0).toUpperCase() + msg.slice(1);

    if (toast.isActive(id)) return;

    toast.success(formattedMsg, {
        toastId: id,
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
};


const displayError = (msg: String, id: Id) => {
    if (!msg) return

    msg = msg.trim()[0].toUpperCase() + msg.slice(1);

    if (toast.isActive(id)) return;

    toast.error(msg, {
        toastId: id,
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    })
};


export { displaySuccess, displayError }