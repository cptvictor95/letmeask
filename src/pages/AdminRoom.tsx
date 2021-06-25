import React from "react";
import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import { database } from "../services/firebase";
import { QuestionType } from "../interface/Question";

type RoomParams = {
  id: string;
};

export const AdminRoom: React.FC = () => {
  const { user, signOut } = useAuth();
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  const handleCloseRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    history.push("/");
  };

  const handleCheckQuestionAsAnswered = async (questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  };

  const handleHighlightQuestion = async (
    questionId: string,
    question: QuestionType
  ) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !question.isHighlighted,
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>
              Encerrar sala
            </Button>
            <Button onClick={signOut}>Sair</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 &&
            (questions.length === 1 ? (
              <span>{questions.length} pergunta</span>
            ) : (
              <span>{questions.length} perguntas</span>
            ))}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleHighlightQuestion(question.id, question)
                      }
                    >
                      <img src={answerImg} alt="Destacar pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
};
