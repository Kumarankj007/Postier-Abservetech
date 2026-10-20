import { useMutation } from "@tanstack/react-query";
import { patchApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const usePatchMutation = (navi) => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: patchApiMethod,
        onSuccess: (data) => {
            const formattedMessage = data.message.charAt(0).toUpperCase() + data.message.slice(1).toLowerCase();
            toast.success(formattedMessage);
            
            if (navi) {
                navigate(navi)
            }
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });
}

export default usePatchMutation;