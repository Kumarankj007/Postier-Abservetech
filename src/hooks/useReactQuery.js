import { useQuery } from "@tanstack/react-query";
import { getApiMethos } from "@components/services/gobal";
import { APICONSTANT } from "@components/services/config";

const useReactQuery = (key, queryString) => {
  return useQuery({
    queryKey: [key, APICONSTANT[key], queryString],
    queryFn: getApiMethos,
    retry: 0,
  });
};
export default useReactQuery;
