import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "./user.service";
import { UserEditInput, UserFormInput } from "@/types/user.types";
import { Variable } from "lucide-react";

export const useGetUsers = () => {
    const query = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await userService.getAll();
            const { data } = response;
            const responseWithoutAdmin = data.filter((user) => user.role !== 'admin');
            const newResponse = {
                ...response,
                data: responseWithoutAdmin
            }
            return newResponse;
        }
    });
    return query;
};

export const useGetUserById = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await userService.getById(id);
            return response;
        },
        enabled: enabled,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['createUser'],
        mutationFn: async (data: UserFormInput) => {
            const response = await userService.create(data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ["clearRedisCache"] });
        }
    });
};

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
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['updateUser'],
        mutationFn: async ({ id, data }: { id: string; data: UserEditInput }) => {
            const response = await userService.update(id, data);
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users' ] });
            queryClient.invalidateQueries({ queryKey: ["clearRedisCache"] });
            queryClient.invalidateQueries({ queryKey: ['userInfo'] });
            queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
        }
    });
};