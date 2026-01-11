import React from "react";

interface MessageProps {
  text: string;
  type: "success" | "error";
}

const Message: React.FC<MessageProps> = ({ text, type }) => {
  const colorClass = type === "success" ? "text-green-600" : "text-red-600";

  return (
    <p className={`mt-2 text-sm ${colorClass}`}>
      {text}
    </p>
  );
};

export default Message;