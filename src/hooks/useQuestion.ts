import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnswerType } from "../interface/Answer";
import { RoomParams } from "../interface/Room";
import { database } from "../services/firebase";

type FirebaseAnswers = Record<
  string,
  {
    id: string;
    questionId: string;
    content: string;
    author: {
      name: string;
      avatar: string;
    };
  }
>;

export const useQuestion = (questionId: string) => {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [answers, setAnswers] = useState<AnswerType[]>([]);

  useEffect(() => {
    const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`);

    questionRef.on("value", (question) => {
      const databaseQuestion = question.val();
      const firebaseAnswers: FirebaseAnswers = databaseQuestion.answers ?? {};
      const parsedAnswers = Object.entries(firebaseAnswers).map(
        ([key, value]) => {
          return {
            id: key,
            questionId: value.questionId,
            content: value.content,
            author: value.author,
          };
        }
      );
      setAnswers(parsedAnswers);
    });

    return () => {
      questionRef.off("value");
    };
  }, [roomId, questionId]);

  return { answers };
};
