import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButton = () => {
  const { signIn, isLoaded } = useSignIn();
  if (!isLoaded) {
    return null;
  }
  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };
  return (
    <div className="">
      <Button
        onClick={signInWithGoogle}
        variant={"secondary"}
        className="w-full text-xs text-white border-zinc-200 h-7 sm:h-11 sm:text-base"
      >
        <img src="/google.png" alt="Google" className="size-3 sm:size-5" />
        Signin with google
      </Button>
    </div>
  );
};

export default SignInOAuthButton;
