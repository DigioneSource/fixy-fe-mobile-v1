import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

// QueryClient dùng chung: layout gắn vào Provider, đăng xuất dùng để xoá dữ liệu của người dùng trước.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Chỉ thử lại khi lỗi mạng hoặc lỗi máy chủ (5xx), không thử lại lỗi 4xx.
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status && status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

// Dừng polling khi app chạy nền để đỡ tốn pin và dữ liệu.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (status) => {
    focusManager.setFocused(status === 'active');
  });
}
