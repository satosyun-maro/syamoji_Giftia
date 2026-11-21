// lib/api.ts — 2週目：searchGifts() の中身を「FastAPI に聞く」に差し替える（完成例）
// 1週目の lib/sampleGifts.ts は、このファイルに置き換える（ダミーは使わない）。

// 画面が使う商品の形。1週目と同じ（画面・ResultCard は変えない）
export type Gift = {
  id: string;          // 商品ID（例 G0001）
  category: string;    // カテゴリ
  brand: string;       // ブランド・店名
  name: string;        // 商品名
  price: number;       // 価格（円）
  rating: number | null; // レビューの平均。レビューがない商品は null（0 とは区別する）
  reviewCount: number; // レビュー件数
  description: string; // 説明文（原文のまま。カードでは冒頭2行だけ見せる）
  matchedTags: string[]; // 選んだタグのうち、この商品に付いているタグ名（タグを選ばないときは空）
};

// 画面から渡す検索条件（2つのタブの分をまとめて持つ）
export type SearchCondition = {
  keyword: string;    // いまの検索：キーワード
  category: string;   // いまの検索：カテゴリー（空ならすべて）
  indivWrap: boolean; // 取引先へのお礼：個包装だけ
  priceBand: string;  // 取引先へのお礼："" | "3000" | "5000"
  priceMin: number | null; // いまの検索：予算の下限（円）。null なら下限なし（送らない）
  priceMax: number | null; // いまの検索：予算の上限（円）。null なら上限なし（送らない）
};

// API の場所。NEXT_PUBLIC_ の値はブラウザに配られる＝秘密は置かない（.env.local に書く）
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// 入力した条件をサーバー（FastAPI）に送り、結果（Gift の配列）をもらう
export async function searchGifts(c: SearchCondition): Promise<Gift[]> {
  // ① 条件を URL のクエリ（?q=...&category=...）に組み立てる。空の条件は送らない
  const params = new URLSearchParams();
  if (c.keyword) params.set("q", c.keyword);
  if (c.category) params.set("category", c.category);
  if (c.indivWrap) params.set("indiv_wrap", "true");
  if (c.priceBand === "3000") { params.set("price_min", "3000"); params.set("price_max", "4999"); } // 3,000以上 5,000未満
  if (c.priceBand === "5000") { params.set("price_min", "5000"); params.set("price_max", "9999"); } // 5,000以上 10,000未満
  // いまの検索の予算スライダー（FR-08-01）。API は「下限以上・上限以下」で絞る（ちょうどの金額も含む）
  if (c.priceMin !== null) params.set("price_min", String(c.priceMin));
  if (c.priceMax !== null) params.set("price_max", String(c.priceMax));

  // ② fetch で API を呼ぶ（通信が終わるまで待つ＝await）
  const res = await fetch(`${API}/api/search?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // ③ 返ってきた JSON を読む。{ total, results } の results が Gift の配列
  const data = await res.json();
  return data.results;
}
