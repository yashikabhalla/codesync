import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join Collabrix today</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-violet-600 hover:bg-violet-700",
              card: "bg-gray-900 border border-white/10",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
              formFieldInput: "bg-gray-800 border-gray-700 text-white",
              formFieldLabel: "text-gray-300",
              footerActionLink: "text-violet-400 hover:text-violet-300",
            },
          }}
        />
      </div>
    </div>
  );
}