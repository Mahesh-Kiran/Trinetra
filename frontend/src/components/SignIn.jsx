import { SignIn } from '@clerk/clerk-react';
import AuthLayout from './AuthLayout';

const SignInPage = () => {
  return (
    <AuthLayout 
      title="SYSTEM ACCESS" 
      subtitle="Authentication required for SAR terminal"
    >
      <div className="space-y-6">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none p-0 border-none flex flex-col items-end text-right space-y-4",
              headerTitle: "text-white text-xl font-mono font-bold mb-2 tracking-wider uppercase",
              headerSubtitle: "text-gray-400 mb-6 font-mono text-sm",
              formButtonPrimary: "bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-mono font-semibold py-3 px-4 transition-all duration-200 shadow-lg hover:shadow-xl tracking-wide uppercase text-sm",
              formFieldInput: "bg-black/60 border border-gray-600 text-white placeholder-gray-500 px-4 py-3 focus:ring-1 focus:ring-white focus:border-white backdrop-blur-sm font-mono transition-all duration-200",
              formFieldLabel: "text-gray-300 font-mono font-medium mb-2 tracking-wide uppercase text-sm",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-500 font-mono text-xs",
              socialButtonsBlockButton: "bg-black/40 border border-gray-600 text-white hover:bg-gray-800 transition-all duration-200 py-3 px-4 font-mono",
              socialButtonsBlockButtonText: "text-white font-mono font-medium tracking-wide",
              footerActionLink: "text-gray-400 hover:text-white transition-colors duration-200 font-mono text-sm",
              footerActionText: "text-gray-500 font-mono text-sm",
              identityPreviewText: "text-gray-400 font-mono",
              identityPreviewEditButton: "text-gray-400 hover:text-white font-mono",
              formFieldErrorText: "text-red-400 font-mono text-xs",
              alertClerkComponentsOneTimeCodeAnyStringType: "bg-black/60 border-gray-600 text-white font-mono",
              formFieldSuccessText: "text-green-400 font-mono text-xs",
              formFieldHintText: "text-gray-500 font-mono text-xs",
              formFieldAction__password: "text-gray-400 hover:text-white font-mono text-sm",
              formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
              formHeaderTitle: "text-white font-mono tracking-wider uppercase",
              formHeaderSubtitle: "text-gray-400 font-mono text-sm",
              otpCodeField: "bg-black/60 border border-gray-600 text-white font-mono text-center",
              otpCodeFieldInput: "bg-transparent text-white font-mono text-center",
              modalBackdrop: "bg-black/80",
              modalContent: "bg-gray-900 border border-gray-600"
            },
            variables: {
              colorPrimary: "#2563eb",
              colorDanger: "#ef4444",
              colorSuccess: "#10b981",
              colorWarning: "#f59e0b",
              colorNeutral: "#6b7280",
              colorText: "#ffffff",
              colorTextSecondary: "#9ca3af",
              colorBackground: "transparent",
              colorInputText: "#ffffff",
              colorInputBackground: "rgba(0,0,0,0.6)",
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace",
              fontSize: "14px",
              borderRadius: "4px"
            }
          }}
          routing="path"
          path="/sign-in"
        />

        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500">
            <span>TERMINAL: SECURE</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
