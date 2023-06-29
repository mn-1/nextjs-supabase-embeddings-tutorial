import KnowledgeButton from "./components/knowledge/knowledge-button";
import QuestionNew from "./components/question/question-new";

const crypto = require("crypto");

// メインページ
const Page = () => {
  for (let i = 0; i < 20; i++) {
    console.log("crypto: ", crypto.randomUUID());
  }

  return (
    <div className='h-full'>
      <KnowledgeButton />
      <QuestionNew />
    </div>
  );
};

export default Page;
