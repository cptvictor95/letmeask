import React from "react";
import { database } from "../services/firebase";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { Header } from "../components/Header";
import { QuestionType } from "../interface/Question";

import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import emptyImg from "../assets/images/empty-questions.svg";
import "../styles/room.scss";
import { useTheme } from "../hooks/useTheme";

type RoomParams = {
  id: string;
};

export const AdminRoom: React.FC = () => {
  const { signOut } = useAuth();
  const { theme } = useTheme();
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
    <div id="page-room" className={theme}>
      <Header>
        <RoomCode code={roomId} />
        <Button isOutlined onClick={handleCloseRoom}>
          Encerrar sala
        </Button>
        <Button onClick={signOut} className="button danger">
          Sair
        </Button>
      </Header>

      <main>
        <div className="room-title">
          <h1>{title ? title : "Nome da sala"}</h1>
          {questions.length > 0 &&
            (questions.length === 1 ? (
              <span>{questions.length} pergunta</span>
            ) : (
              <span>{questions.length} perguntas</span>
            ))}
        </div>

        <div className="question-list">
          {questions && questions.length === 0 ? (
            <div className="empty-questions">
              <img src={emptyImg} alt="" />
              <h2>Nenhuma pergunta por aqui</h2>
              <p>
                Envie o código desta sala para seus amigos e comece a responder
                perguntas!
              </p>
            </div>
          ) : (
            questions.map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  answers={question.answers}
                  questionId={question.id}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckQuestionAsAnswered(question.id)
                        }
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
            })
          )}
        </div>
      </main>
    </div>
  );
};
