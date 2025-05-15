import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 menit
            retry: 1
        }
    }
});

interface QueryClientWrapperProps {
    children: ReactNode;
}

export function QueryClientWrapper({ children }: QueryClientWrapperProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
