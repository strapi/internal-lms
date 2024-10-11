import Spinner from "@/components/ui/Spinner";
import { createFileRoute, redirect } from "@tanstack/react-router";
import queryClient from "@/lib/queryClient";
import { AUTH_KEY, STRAPI_URL } from "@/lib/utils";

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

    localStorage.setItem(AUTH_KEY, responseBody.jwt);
    localStorage.setItem("user_info", JSON.stringify(responseBody.user));

    // TODO: We definitely do not want to keep using setTimeout
    setTimeout(() => {
      window.location.assign("/dashboard");
    }, 500);
  },

  component: () => {
    return (
      <div>
        <Spinner text="Please wait..." />
      </div>
    );
  },
});
