import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getMe } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import NotFoundPage from "@/pages/NotFoundPage";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "OWNER" | "HOTEL_ADMIN" | "USER";
  requiredRoles?: ("OWNER" | "HOTEL_ADMIN" | "USER")[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Получаем актуальную информацию о пользователе с сервера
  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!user, // Запрашиваем только если пользователь авторизован
    retry: 0,
  });

  // Показываем загрузку пока проверяем аутентификацию
  if (isLoading || meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user || !me) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Проверяем роли
  const allowedRoles = requiredRoles || (requiredRole ? [requiredRole] : []);
  const hasRequiredRole =
    allowedRoles.length === 0 || allowedRoles.includes(me.role as any);

  if (!hasRequiredRole) {
    // Для OWNER роли показываем 404 вместо access denied
    if (allowedRoles.includes("OWNER")) {
      return <NotFoundPage />;
    }
    return <Navigate to="/access-denied" replace />;
  }

  // Если все проверки пройдены, показываем защищенный контент
  return <>{children}</>;
}
