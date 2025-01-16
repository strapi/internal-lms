import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import strapiLogo from "../assets/strapi-logo.svg";
import { STRAPI_URL, PROVIDERS } from "@/lib/utils";

export default function Login() {
  return (
    <div className="flex h-[calc(100vh-56px)] w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold">Welcome to Strapi LMS!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Unlock Learning, Strapi Style!
        </p>
      </div>
      <div className="mx-4 flex max-w-2xl flex-col items-center space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 w-32 overflow-hidden rounded-full">
            <img
              src={strapiLogo}
              width={128}
              height={128}
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        {PROVIDERS.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.assign(
                `${STRAPI_URL}/api/connect/${provider.id}`,
              );
            }}
          >
            {/* TODO: Map to corrct logo */}
            <FcGoogle className="mr-2 h-4 w-4" />
            {provider.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
