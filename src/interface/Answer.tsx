export interface AnswerType {
  questionId: string;
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
}
