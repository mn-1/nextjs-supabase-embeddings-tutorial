import { createClient } from "../../utils/supabase-server";
import KnowledgeNew from "../components/knowledge/knowledge-new";

type UrlType = {
  url: string;
}[];

const Knowledge = async () => {
  const supabase = createClient();

  // 知識データベースリスト取得
  // 重複を除いたURLのリストを取得する
  const { data, error } = await supabase
    .from("distinct_url")
    .select("url") // ここ必要 ('*')と()とかだと空になる
    .returns<any>();

  console.log("urls: ", data); // 1行しか取得できない

  if (error) {
    console.error("Error: ", error);
  }

  return <KnowledgeNew knowledge_urls={data} />;
};

export default Knowledge;
