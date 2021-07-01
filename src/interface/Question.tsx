import { AnswerType } from "./Answer";

export interface QuestionType {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
  answers: AnswerType[];
}

export type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    answers: AnswerType[];
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;
