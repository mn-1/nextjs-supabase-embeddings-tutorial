import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { supabase } from "../../utils/supabase-js";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// 文章の最大文字数
const maxSize = 500;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { urls } = req.body;
  const documents = [];

  try {
    for (const url of urls) {
      // urlから記事をDomとして取得
      const dom = await JSDOM.fromURL(url);
      // 記事の内容をシンプルにする
      const reader = new Readability(dom.window.document);
      // 記事の内容を取得
      const article = reader.parse();

      if (!article) {
        throw new Error(`内容の取得に失敗しました: ${url}`);
      }

      // DOMParserを使ってHTML文字列をDOM(Document Object Model)に変換
      // parseFromStringメソッドはHTML形式の文字列(article.content)をDOMオブジェクトに変換
      // domのbody要素のテキストを取得
      const articleText =
        new dom.window.DOMParser().parseFromString(article.content, "text/html")
          .body.textContent || "";

      let start = 0;
      while (start < articleText.length) {
        // 文章を500文字づつに分割してdocumentsに追加
        const end = start + maxSize;
        const chunk = articleText.slice(start, end);
        documents.push({ url, body: chunk });
        start = end;
      }

      // 古いデータを削除
      // urlが一致するデータを削除
      await supabase.from("documents").delete().eq("url", url);
    }

    for (const { url, body } of documents) {
      // 改行を空白に変換
      const input = body.replace(/\n/g, " ");

      // ここまではきてる

      // Embeddings
      // 文章をベクトルに変換
      const res_embedding = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        // input,
        input: "Your text string goes here",
      });

      // ベクトル取得
      const [{ embedding }] = res_embedding.data.data;

      // テーブルにカラム追加
      await supabase.from("documents").insert({
        content: input,
        embedding,
        url,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
    return;
  }
};

export default handler;
