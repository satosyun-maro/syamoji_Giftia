// app/ResultCard.tsx — 結果カード（部品）。2週目の変更は import の1行だけ（Gift 型の置き場所が lib/api.ts に変わった）
import type { Gift } from "@/lib/api";

export default function ResultCard({ gift, rank }: { gift: Gift; rank: number }) {
  return (
    <div className="card">
      <p className="meta">{rank}位・{gift.category}・{gift.brand}</p>
      <h3 className="name">{gift.name}</h3>
      <p className="price">{gift.price.toLocaleString()}円</p>
      {/* rating が null のときは「レビューなし」。0 のときは数字の 0 を出す（null と 0 は別） */}
      <p className="meta">
        {gift.rating === null ? (
          "レビューなし"
        ) : (
          <>
            <span className="rating">★{gift.rating}</span>（レビュー{gift.reviewCount}件）
          </>
        )}
      </p>
      {/* 一致したタグ名。タグを選んでいないときは空なので何も出さない */}
      {gift.matchedTags.length > 0 && (
        <p className="tags">{gift.matchedTags.map((t) => <span key={t} className="tag">{t}</span>)}</p>
      )}
      {/* 説明文は原文のまま。冒頭2行だけ見せる（CSSで2行に切る） */}
      <p className="desc">{gift.description}</p>
    </div>
  );
}
