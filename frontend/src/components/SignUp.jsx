import { SignUp } from '@clerk/clerk-react';
import AuthLayout from './AuthLayout';

const SignUpPage = () => {
  return (
    <AuthLayout 
      title="Join SAR Client" 
      subtitle="Create your account to get started"
    >
      <div className="space-y-6">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none p-0 border-none w-full",
              headerTitle: "text-white text-lg font-mono font-bold mb-3 tracking-wider uppercase text-center",
              headerSubtitle: "text-gray-400 mb-8 font-mono text-sm text-center leading-relaxed",
              formButtonPrimary: "w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-mono font-semibold py-4 px-6 transition-all duration-200 shadow-lg hover:shadow-xl tracking-wide uppercase text-sm mt-6",
              formFieldInput: "w-full bg-black/60 border border-gray-600 text-white placeholder-gray-500 px-4 py-4 focus:ring-1 focus:ring-white focus:border-white backdrop-blur-sm font-mono transition-all duration-200 text-sm",
              formFieldLabel: "text-gray-300 font-mono font-medium mb-3 tracking-wide uppercase text-sm block",
              dividerLine: "bg-gray-600 my-8",
              dividerText: "text-gray-500 font-mono text-xs px-4",
              socialButtonsBlockButton: "w-full bg-black/40 border border-gray-600 text-white hover:bg-gray-800 transition-all duration-200 py-4 px-6 font-mono mb-4",
              socialButtonsBlockButtonText: "text-white font-mono font-medium tracking-wide text-sm",
              footerActionLink: "text-gray-400 hover:text-white transition-colors duration-200 font-mono text-sm",
              footerActionText: "text-gray-500 font-mono text-sm",
              identityPreviewText: "text-gray-400 font-mono text-sm",
              identityPreviewEditButton: "text-gray-400 hover:text-white font-mono text-sm",
              formFieldErrorText: "text-red-400 font-mono text-xs mt-2",
              formFieldSuccessText: "text-green-400 font-mono text-xs mt-2",
              formFieldHintText: "text-gray-500 font-mono text-xs mt-2",
              formFieldAction__password: "text-gray-400 hover:text-white font-mono text-sm",
              formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
              formHeaderTitle: "text-white font-mono tracking-wider uppercase text-center",
              formHeaderSubtitle: "text-gray-400 font-mono text-sm text-center",
              otpCodeField: "bg-black/60 border border-gray-600 text-white font-mono text-center",
              otpCodeFieldInput: "bg-transparent text-white font-mono text-center",
              modalBackdrop: "bg-black/80",
              modalContent: "bg-gray-900 border border-gray-600",
              footer: "mt-8 pt-6 border-t border-gray-700",
              footerAction: "text-center",
              socialButtonsBlock: "space-y-4 mb-6",
              formFieldRow: "mb-6",
              form: "space-y-6"
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
              borderRadius: "0px",
              spacingUnit: "1rem"
            }
          }}
          routing="path"
          path="/sign-up"
        />

        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500">
            <span>NEW USER REGISTRATION</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>READY</span>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
