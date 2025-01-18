import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";

export function useAuth() {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["user"], null);
  };

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await authService.getUser();
      return response.data;
    },
    enabled: !!localStorage.getItem("token"),
    onError: () => {
      localStorage.removeItem("token");
    },
  });

  return {
    user,
    isLoading,
    logout,
  };
}
