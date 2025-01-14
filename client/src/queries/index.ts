import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
            // staleTime: 5 * 1000,
        },
        mutations: {
            // onError(_error, _variables, _context) {},
            retry: 1,
        },
    },
});


