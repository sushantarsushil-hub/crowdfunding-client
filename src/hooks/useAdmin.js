export * from './useUsers';
import useUsersDefault from './useUsers';

export const useAdminStats = useUsersDefault.useAdminStats;
export const useAdminUsers = useUsersDefault.useAdminUsers;
export const useUpdateUserRole = useUsersDefault.useUpdateUserRole;
export const useDeleteUser = useUsersDefault.useDeleteUser;

export default useUsersDefault;
