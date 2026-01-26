import LoginRegisterForm from "@/components/loginRegister/LoginRegisterForm";

export default function Login_Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vítejte v CoVenku
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Objevujte kulturní místa a události ve vašem okolí
          </p>
        </div>
        <LoginRegisterForm />
      </div>
    </div>
  );
}
