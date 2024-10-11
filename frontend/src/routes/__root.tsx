import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { lazy } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";

const TanStackRouterDevtools =
  process.env.NODE_ENV !== "production"
    ? lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )
    : () => null;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <>
        <Outlet />
        {TanStackRouterDevtools && <TanStackRouterDevtools />}
        <ReactQueryDevtools initialIsOpen={false} />
      </>
    ),
  },
);
