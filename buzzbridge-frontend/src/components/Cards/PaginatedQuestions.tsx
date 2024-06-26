import React, { useEffect, useState } from "react";
import useCustomAxios from "../../utils/helpers/customAxios";
import { QuestionType } from "../../types/QuestionTypes";
import QuestionCard from "./QuestionCard";
import { Tab, Tabs } from "@mui/material";
import EmptyContentCard from "./EmptyContentCard";

const PaginatedQuestions = ({
  firstTab,
  limit,
}: {
  firstTab: string;
  limit: number;
}) => {
  const axiosInstance = useCustomAxios();
  const switchTabContent = ["latest", "popular", "following"];
  const [loading, setLoading] = useState<boolean>(false);
  const [maxPage, setMaxPage] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(firstTab);
  const [pageCount, setPageCount] = useState<any>({
    popularQuestionsPageCount: 1,
    latestQuestionsPageCount: 1,
    followingQuestionsPageCount: 1,
  });
  const [popular, setPopular] = useState<QuestionType[]>([]);
  const [latest, setLatest] = useState<QuestionType[]>([]);
  const [following, setFollowing] = useState<QuestionType[]>([]);
  const handleLoadData = async (
    tab: string,
    limit: number,
    buttonCall: boolean
  ) => {
    setLoading(true);
    try {
      const page = pageCount[`${tab}QuestionsPageCount`] || 1;
      if (page > 1 && buttonCall) {
        setLoading(false);
        return;
      }
      const URL = `question/${tab}?page=${page}&limit=${limit}`;
      const response = await axiosInstance.get(URL);
      setPageCount((prevCounts: any) => ({
        ...prevCounts,
        [`${tab}QuestionsPageCount`]:
          prevCounts[`${tab}QuestionsPageCount`] + 1,
      }));
      if(response.data.length === 0) {
        setMaxPage(true);
        return setLoading(false);
      }
      switch (tab) {
        case "popular":
          setPopular((prev) => prev.concat(response.data));
          break;
        case "latest":
          setLatest((prev) => prev.concat(response.data));
          break;
        case "following":
          setFollowing((prev) => prev.concat(response.data));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const getCurrentTabData = () => {
    switch (currentTab) {
      case "popular":
        return popular;
      case "latest":
        return latest;
      case "following":
        return following;
      default:
        return [];
    }
  };
  useEffect(() => {
    handleLoadData(firstTab, limit, true);
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (!loading && !maxPage) {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100
        ) {
          handleLoadData(currentTab, limit, false);
          window.removeEventListener("scroll", handleScroll);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    pageCount.popularQuestionsPageCount,
    pageCount.latestQuestionsPageCount,
    pageCount.followingQuestionsPageCount,
    currentTab,
    loading,
    maxPage,
  ]);
  

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => setCurrentTab(newValue)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        textColor="primary"
        indicatorColor="primary"
        sx={{ width: "100%", marginBottom: "2%" }}
      >
        {switchTabContent.map((tab, index) => (
          <Tab
            key={index}
            value={tab}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            onClick={() => {
              handleLoadData(tab, limit, true);
            }}
          />
        ))}
      </Tabs>
      {getCurrentTabData().length > 0 ? (
        getCurrentTabData().map((question: QuestionType, index: number) => (
          <QuestionCard
            key={index}
            question={question}
            displayAnswers
            setQuestions={
              currentTab === "following"
                ? setFollowing
                : currentTab === "popular"
                ? setPopular
                : setLatest
            }
            loading={loading}
          />
        ))
      ) : (
        <>
          <EmptyContentCard type="question" loading={loading} />
          {loading && <EmptyContentCard type="question" loading={loading} />}
        </>
      )}
    </>
  );
};

export default PaginatedQuestions;
