import React from "react";
import { AnswerType } from "../../interface/Answer";
import "./styles.scss";

export const Answer: React.FC<{
  answer: AnswerType;
}> = ({ answer }) => {
  return (
    <div className="answer">
      <p>{answer.content}</p>
      <footer>
        <div className="user-info">
          <img src={answer.author.avatar} alt={answer.author.name} />
          <span>{answer.author.name}</span>
        </div>
      </footer>
    </div>
  );
};
