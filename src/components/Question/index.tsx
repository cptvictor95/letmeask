import React from "react";
import "./styles.scss";
import classnames from "classnames";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isAnswered: boolean;
  isHighlighted: boolean;
  children?: React.ReactNode;
};

export const Question = ({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
}: QuestionProps) => {
  return (
    <div
      className={classnames("question", {
        answered: isAnswered,
        highlighted: isHighlighted && !isAnswered,
      })}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
};
