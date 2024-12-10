import { SignIn } from "@clerk/nextjs";
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-law-blue-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-md shadow-sm border border-neutral-200">
        <div className="p-4 sm:p-8">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Link href="/" className="text-2xl sm:text-3xl font-bold text-law-blue-800 flex items-center">
              <FileText className="mr-2 h-6 w-6 sm:h-7 sm:w-7" />
              MedLegal Scribe
            </Link>
          </div>
          
          <div className="flex justify-center w-full">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-law-blue-700 hover:bg-law-blue-800 text-white rounded-md py-2.5 px-4 w-full transition-colors duration-200",
                  card: "border-none bg-white shadow-none w-full",
                  headerTitle: "text-xl sm:text-2xl font-bold text-law-blue-900 text-center mb-4 sm:mb-6",
                  headerSubtitle: "text-neutral-600 text-center",
                  socialButtonsBlockButton: 
                    "border border-neutral-200 hover:border-law-blue-300 hover:bg-law-blue-50 w-full rounded-md transition-all duration-200",
                  formFieldInput: 
                    "w-full px-4 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-law-blue-200 focus:border-law-blue-300 transition-all duration-200",
                  footer: "hidden",
                  rootBox: "w-full flex justify-center",
                  card__main: "w-full",
                  form: "w-full",
                  formFieldLabel: "text-neutral-700 font-medium",
                },
                layout: {
                  socialButtonsPlacement: "bottom",
                  privacyPageUrl: "hidden",
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm leading-5 text-center text-neutral-600">
              Need a professional account?{' '}
              <Link href="/sign-up" className="font-medium text-law-blue-700 hover:text-law-blue-800">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}