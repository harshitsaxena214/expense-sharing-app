import { Suspense } from "react";
import SignupForm from "./SignupForm";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <SignupForm />
    </Suspense>
  );
}