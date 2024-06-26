import QuestionCard from "./QuestionCard";
import TopicCard from "./TopicCard";
import { AnswerTypes } from "../../types/AnswerTypes";
import AnswerCard from "./AnswerCard";
import { QuestionType } from "../../types/QuestionTypes";
import { TopicTypes } from "../../types/TopicTypes";
import EmptyContentCard from "./EmptyContentCard";

const PaginatedCards = ({
  currentTab,
  data,
  setData,
  loading,
}: {
  currentTab: string;
  data: any;
  setData: any;
  loading: boolean;
}) => {
  return (
    <>
      {data.length > 0 ? (
        <>
          {currentTab === "question" && (
            <>
              {data.map((question: QuestionType, index: number) => (
                <QuestionCard
                  key={index}
                  question={question}
                  setQuestions={setData}
                  loading={loading}
                />
              ))}
            </>
          )}
          {currentTab === "topic" && (
            <>
              {data.map((topic: TopicTypes, index: number) => (
                <TopicCard
                  key={index}
                  topic={topic}
                  enlarge
                  backgroundColor={"white"}
                  setTopics={setData}
                  loading={loading}
                />
              ))}
            </>
          )}
          {currentTab === "following" && (
            <>
              {data.map((topic: TopicTypes, index: number) => (
                <TopicCard
                  key={index}
                  topic={topic}
                  enlarge
                  backgroundColor={"white"}
                  setTopics={setData}
                  loading={loading}
                />
              ))}
            </>
          )}
          {currentTab === "answer" && (
            <>
              {data.map((answer: AnswerTypes, index: number) => (
                <AnswerCard
                  key={index}
                  answer={answer}
                  setAnswers={setData}
                  loading={loading}
                />
              ))}
            </>
          )}
        </>
      ) : (
        <EmptyContentCard type={currentTab} loading={loading}/>
      )}
    </>
  );
};

export default PaginatedCards;
