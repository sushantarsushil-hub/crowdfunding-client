import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import notificationsService from '../services/notifications';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Fetch current user notifications
 */
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(params),
    queryFn: () => notificationsService.getNotifications(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Fetch unread notification count badge count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    queryFn: () => notificationsService.getUnreadCount(),
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Mutation: Mark single notification read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationsService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update notification.');
    },
  });
};

export const useMarkAsRead = useMarkNotificationAsRead;

/**
 * Mutation: Mark all notifications read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllNotificationsAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update notifications.');
    },
  });
};

export const useMarkAllAsRead = useMarkAllNotificationsAsRead;

/**
 * Mutation: Delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationsService.deleteNotification(id),
    onSuccess: () => {
      toast.success('Notification removed.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete notification.');
    },
  });
};

export default {
  useNotifications,
  useUnreadCount,
  useMarkNotificationAsRead,
  useMarkAsRead,
  useMarkAllNotificationsAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
};
