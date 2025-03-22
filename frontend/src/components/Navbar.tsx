import { SignedOut, UserButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButton from "./SignInOAuthButton";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import NavbarSkeleton from "./skeletons/NavbarSkeleton";

const Navbar = () => {
  const { isAdmin, adminStatus, isLoading } = useAuthStore();
  const { isLoaded, isSignedIn } = useAuth();

  // Fetch admin status on component mount and when isLoaded changes
  useEffect(() => {
    if (isLoaded) {
      //   console.log("Fetching admin status...");
      adminStatus();
    }
  }, [isLoaded, adminStatus]);

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  // Render the actual Navbar content after loading is complete
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-zinc-900/75 backdrop-blur-md">
      <div className="flex items-center gap-1">
        <Link to="/" className="flex items-center text-xl font-bold">
          <img
            src="/musicfy.png"
            className="size-4 md:size-8"
            alt="Musicfy logo"
          />
          <span className="text-sm md:text-2xl">Musicfy</span>
        </Link>
      </div>
      <div className="flex items-center gap-1 text-xs sm:gap-4 md:text-xl">
        {isAdmin && isSignedIn ? (
          <Link
            to={"/admin"}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
                className: "md:size-default",
              })
            )}
          >
            <LayoutDashboardIcon className="mr-2 size-2 sm:size-4" />
            Dashboard
          </Link>
        ) : (
          <SignedOut>
            <SignInOAuthButton />
          </SignedOut>
        )}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
