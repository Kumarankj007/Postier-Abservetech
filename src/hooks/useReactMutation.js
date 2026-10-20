import { useMutation } from "@tanstack/react-query";
import { putApiMethod, postApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useReactMutation = (apiMethods, navi) => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: apiMethods,
    onSuccess: (data) => {
      // debugger;
      toast.success(data.message);
      if (options.onSuccess && typeof options.onSuccess === 'function')
        onSuccess(data);
      if (navi) {
        navigate(navi)
      }
    },

    onError: (err) => {
      console.log("err", err);
      toast.error(err.message);
      if (options.onError && typeof options.onError === 'function')
        onError(data);
    },
    if(navi) {
      navigate(navi)
    }
  });
}

export default useReactMutation;