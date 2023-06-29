-- タイムゾーン設定
alter database postgres
set
    timezone to 'Asia/Tokyo';

-- extension
-- vector: ベクトル型
-- moddatetime: テーブル更新日時を取得する関数
-- DB内にpostgreの拡張機能を読み込む
create extension if not exists vector;

create extension if not exists moddatetime schema extensions;

-- documentsテーブル
create table documents (
    id bigserial primary key,
    content text not null,
    url text not null,
    -- 長さが1536のベクトル型
    embedding vector(1536),
    created_at timestamp default now() not null
);

-- documentsテーブルRLS設定
-- RLS: ロールレベルセキュリティはデータの読み込み時にテーブルの行レベルでアクセスを制御する機能
alter table
    documents enable row level security;

-- "すべて許可"という名前のポリシーを作成
-- publicスキーマのdocumentsテーブルに対して適用され、全てのユーザーに対して許可されるように設定
-- ポリシーの条件としてusing (true)が指定されており、ポリシーのチェック条件としてwith check (true)が指定されています。ポリシーは全ての操作を許可し、条件のチェックを行わないことを意味します。
create policy "すべて許可" on "public"."documents" as permissive for all to public using (true) with check (true);

-- URL重複削除
-- distinct_urlという名前のビューを作成
-- DOCUMENTSテーブルから重複のないURLを取得するして、仮想のテーブルを作成
create
or replace view distinct_url as
select
    distinct url
from
    documents;

-- ドキュメント検索
-- DBの中から検索クエリに最も類似したドキュメントを取得する関数
-- "match_documents"という名前の関数を作成または置換
create -- パラメーター3つ
or replace function match_documents (
    -- 検索クエリの埋め込みベクトル
    query_embedding vector(1536),
    -- 類似度のしきい値
    similarity_threshold float,
    -- 一致するドキュメントの最大数
    match_count int
) returns table (
    -- 戻り値4つ
    id bigint,
    content text,
    url text,
    similarity float
) language plpgsql as $ $ begin return query
select
    documents.id,
    documents.content,
    documents.url,
    -- 二つのベクトルの類似度を計算
    -- この類似度の値がsimilarityというカラムに割り当てられ、関数の結果として返されるテーブルに含まれます。
    (documents.embedding <= > query_embedding) as similarity
from
    documents
where
    (documents.embedding <= > query_embedding) > similarity_threshold
order by
    -- 結果は類似度の降順でソートされ、指定された一致数に制限されます
    documents.embedding <= > query_embedding
limit
    match_count;

end;

$ $;

-- 閾値：しきいち
-- ギリギリの値、条件分岐の境目、あと少しズレると動作や表示内容などが変わるギリギリの値のこと