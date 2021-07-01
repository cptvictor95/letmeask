import React, { FormEvent } from "react";
import "./styles.scss";
import classnames from "classnames";
import { Answer } from "../Answer";
import { AnswerType } from "../../interface/Answer";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import { useParams } from "react-router-dom";
import { RoomParams } from "../../interface/Room";
import { useQuestion } from "../../hooks/useQuestion";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isAnswered: boolean;
  isHighlighted: boolean;
  answers?: AnswerType[];
  questionId: string;
  children?: React.ReactNode;
};

export const Question = ({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  questionId,
  children,
}: QuestionProps) => {
  const { user } = useAuth();
  const [newAnswer, setNewAnswer] = useState("");
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { answers } = useQuestion(questionId);

  const handleSendAnswer = async (questionId: string) => {
    const answer = {
      content: newAnswer,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
    };
    if (questionId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/answers`)
        .push(answer);
    }
    setNewAnswer("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    handleSendAnswer(questionId);
  };

  return (
    <div
      className={classnames("question", {
        answered: isAnswered,
        highlighted: isHighlighted && !isAnswered,
      })}
    >
      <p>{content}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(event) => setNewAnswer(event.target.value)}
          value={newAnswer}
        />
      </form>

      <div>
        {answers &&
          answers.map((answer) => {
            return <Answer key={answer.id} answer={answer} />;
          })}
      </div>
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
