import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "./user.service";

export const useGetUsers = () => {
    const query = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await userService.getAll();
            return response;
        }
    });
    return query;
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['createUser'],
        mutationFn: async (data: { name: string; email: string; role: string; image: File | null; password: string }) => {
            const response = await userService.create(data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['deleteUser'],
        mutationFn: async (id: string) => {
            const response = await userService.delete(id);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['updateUser'],
        mutationFn: async ({ id, data }: { id: string; data: { name: string; email: string; role: string; image: File | null; password: string } }) => {
            const response = await userService.update(id, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
};