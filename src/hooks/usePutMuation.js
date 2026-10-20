import { useMutation } from "@tanstack/react-query";
import { putApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const usePutMutation = (navi) => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: putApiMethod,
    onSuccess: (data) => {
      // debugger;
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

export default usePutMutation;