import { AuthContextType } from "@/context/auth";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { lazy } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface RouterContext {
  auth: AuthContextType;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV !== "production"
    ? lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )
    : () => null;

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      {TanStackRouterDevtools && <TanStackRouterDevtools />}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
});
