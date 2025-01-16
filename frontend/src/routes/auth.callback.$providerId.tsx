import Spinner from "@/components/ui/Spinner";
import { createFileRoute } from "@tanstack/react-router";
import { AUTH_KEY, STRAPI_URL } from "@/lib/utils";

export const Route = createFileRoute("/auth/callback/$providerId")({
  beforeLoad: async (ctx) => {
    const { providerId } = ctx.params;
    const accessToken = (ctx.search as { access_token: string }).access_token;

    try {
      const result = await fetch(
        `${STRAPI_URL}/api/auth/${providerId}/callback?access_token=${accessToken}`,
      );

      if (!result.ok) {
        throw new Error("Login failed");
      }

      const responseBody = await result.json();

      // Save token and user info (replace with session or cookie in production)
      localStorage.setItem(AUTH_KEY, responseBody.jwt);
      localStorage.setItem("user_info", JSON.stringify(responseBody.user));

      // Redirect to dashboard
      window.location.assign("/dashboard");
    } catch (error) {
      console.error("Error during authentication callback:", error);
      window.location.assign("/login");
    }
  },

  component: () => (
    <div>
      <Spinner text="Please wait..." />
    </div>
  ),
});
