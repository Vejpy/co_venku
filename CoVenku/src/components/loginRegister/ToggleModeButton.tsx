import React from "react";

interface ToggleModeButtonProps {
  mode: "login" | "register";
  onToggle: () => void;
}

const ToggleModeButton: React.FC<ToggleModeButtonProps> = ({
  mode,
  onToggle,
}) => {
  return (
    <div className="text-center">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {mode === "login" ? "Nemáte účet? " : "Už máte účet? "}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
      >
        {mode === "login" ? "Zaregistrujte se" : "Přihlaste se"}
      </button>
    </div>
  );
};

export default ToggleModeButton;
