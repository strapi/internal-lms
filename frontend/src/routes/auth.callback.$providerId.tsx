import Spinner from "@/components/ui/Spinner";
import { createFileRoute, redirect } from "@tanstack/react-router";
import queryClient from "@/lib/queryClient";
import { STRAPI_URL } from "@/lib/utils";

interface CtxType {
  params: unknown | null;
  search: {
    access_token: string | null;
  } | null;
}

export const Route = createFileRoute("/auth/callback/$providerId")({
  beforeLoad: async (ctx) => {
    const { providerId } = ctx.params;
    const accessToken = ctx.search.access_token;
    const result = await fetch(
      `${STRAPI_URL}/api/auth/${providerId}/callback?access_token=${accessToken}`,
    );
    if (!result.ok) {
      throw "Login failed";
    }
    const responseBody = await result.json();
    // TODO: Change to either session or cookies from local storage
    localStorage.setItem("jwt", responseBody.jwt);
    localStorage.setItem("user_info", responseBody.user);

    throw redirect({
      to: "/dashboard",
      replace: true,
    });
  },

  component: () => {
    return (
      <div>
        <Spinner text="Please wait..." />
      </div>
    );
  },
});
