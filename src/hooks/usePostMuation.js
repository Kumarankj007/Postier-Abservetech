import { useMutation } from "@tanstack/react-query";
import { postApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const usePostMutation = (navi) => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: postApiMethod,
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

export default usePostMutation;