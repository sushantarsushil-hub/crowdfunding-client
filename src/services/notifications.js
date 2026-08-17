import axiosInstance from '../api/axiosInstance';

/**
 * Get user notifications sorted newest first with pagination/filter
 * GET /notifications
 */
export const getNotifications = async (params = {}) => {
  const response = await axiosInstance.get('/notifications', { params });
  return response.data;
};

/**
 * Get unread notification count for badge counters
 * GET /notifications/unread-count
 */
export const getUnreadCount = async () => {
  const response = await axiosInstance.get('/notifications/unread-count');
  return response.data;
};

/**
 * Mark a single notification as read
 * PATCH /notifications/:id/read
 */
export const markNotificationAsRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAsRead = markNotificationAsRead;

/**
 * Mark all notifications as read for current user
 * PATCH /notifications/read-all
 */
export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch('/notifications/read-all');
  return response.data;
};

export const markAllAsRead = markAllNotificationsAsRead;

/**
 * Delete single notification (owner only)
 * DELETE /notifications/:id
 */
export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};

const notificationsService = {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAsRead,
  markAllNotificationsAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationsService;
