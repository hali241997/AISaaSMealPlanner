import { SignUp } from "@clerk/nextjs";
import { FC } from "react";

const SignUpPage: FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 flex items-center justify-center">
      <SignUp signInFallbackRedirectUrl="/create-profile" />
    </div>
  );
};

export default SignUpPage;
