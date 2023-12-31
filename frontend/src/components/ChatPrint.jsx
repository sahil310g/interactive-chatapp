import React from "react";
import ReceivedTextBubble from "./ReceivedTextBubble";
import SentTextBubble from "./SentTextBubble";

function ChatPrint({ chatList }) {
  return (
    <div>
      <div className="chat-container">
        {chatList.map((chat, index) => {
          return (
            <div
              key={index}
              className={
                chat.role === "user"
                  ? "message sender-message"
                  : "message receiver-message"
              }
            >
              <p>
                {chat.role === "user" ? (
                  <SentTextBubble text={chat.message} />
                ) : (
                  <ReceivedTextBubble user={"AI"} text={chat.message} />
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatPrint;
