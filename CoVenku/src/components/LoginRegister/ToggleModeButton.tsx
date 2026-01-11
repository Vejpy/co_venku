import React from "react";

interface ToggleModeButtonProps {
  mode: "login" | "register";
  onToggle: () => void;
}

const ToggleModeButton: React.FC<ToggleModeButtonProps> = ({ mode, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-blue-600 hover:underline transition"
    >
      {mode === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
    </button>
  );
};

export default ToggleModeButton;
