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
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {mode === "login" ? "Nemáte účet? " : "Už máte účet? "}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
      >
        {mode === "login" ? "Zaregistrujte se" : "Přihlaste se"}
      </button>
    </div>
  );
};

export default ToggleModeButton;
