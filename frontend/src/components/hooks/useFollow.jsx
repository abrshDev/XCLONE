import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
function useFollow() {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userid) => {
      try {
        const res = await fetch(`/api/user/follow/${userid}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something went wrong ");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedusers"] }),
        queryClient.invalidateQueries({ queryKey: ["authusers"] }),
      ]);

      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { follow, isPending };
}

export default useFollow;
