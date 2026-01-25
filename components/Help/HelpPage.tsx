
import React from 'react';

export const HelpPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">使い方ガイド</h2>
        <p className="text-slate-500">研修報告文生成ツールの使い方を説明します。</p>
      </div>

      {/* 概要 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">?</span>
          このツールについて
        </h3>
        <p className="text-slate-600 leading-relaxed">
          このツールは、e-Learning研修を受講した後に提出する「訓練実施報告書」の文章をAIが自動生成するサービスです。
          必要な情報を入力するだけで、自然で実務的な報告文が作成されます。
        </p>
      </section>

      {/* ステップ1 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
          新規作成を開始する
        </h3>
        <div className="space-y-4 text-slate-600">
          <p>トップページの「<strong>新しく作成する</strong>」ボタンをクリックして、報告文の作成を開始します。</p>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-500">💡 過去に作成した履歴がある場合は、履歴カードをクリックして編集を再開できます。</p>
          </div>
        </div>
      </section>

      {/* ステップ2 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
          情報を入力する
        </h3>
        <div className="space-y-4 text-slate-600">
          <p>左側のフォームに以下の情報を入力します：</p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-bold shrink-0">必須</span>
              <div>
                <strong>報告者名・タイトル</strong>
                <p className="text-sm text-slate-500">あなたの名前や報告書のタイトルを入力</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-bold shrink-0">必須</span>
              <div>
                <strong>受講した研修・メインツール</strong>
                <p className="text-sm text-slate-500">研修の種類と主に学んだAIツールを選択</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold shrink-0">推奨</span>
              <div>
                <strong>職種・仕事内容</strong>
                <p className="text-sm text-slate-500">あなたの職種を選ぶと、関連する業務が候補として表示されます</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold shrink-0">推奨</span>
              <div>
                <strong>解決したい課題</strong>
                <p className="text-sm text-slate-500">業務上の課題を選択または入力</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold shrink-0">推奨</span>
              <div>
                <strong>研修で学んだ内容・今後の目標</strong>
                <p className="text-sm text-slate-500">具体的な学びと数値目標を設定するとより説得力のある文章になります</p>
              </div>
            </li>
          </ul>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-700">⚠️ 入力項目が多いほど、より具体的で説得力のある報告文が生成されます。</p>
          </div>
        </div>
      </section>

      {/* ステップ3 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
          文章を生成する
        </h3>
        <div className="space-y-4 text-slate-600">
          <p>「<strong>報告文を生成する</strong>」ボタンをクリックすると、AIが入力内容に基づいて報告文を作成します。</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>標準</strong>：280〜420文字程度の簡潔な報告文</li>
            <li><strong>長文</strong>：450〜650文字程度の詳細な報告文</li>
          </ul>
          <p>タブを切り替えて、両方の長さで生成できます。</p>
        </div>
      </section>

      {/* ステップ4 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
          文章を調整する
        </h3>
        <div className="space-y-4 text-slate-600">
          <p>生成された文章は以下の方法で調整できます：</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>直接編集</strong>：テキストエリアで直接文章を編集</li>
            <li><strong>AIへの追加指示</strong>：「もっと丁寧に」「簡潔にして」などの指示で自動修正</li>
            <li><strong>元に戻す</strong>：AI修正前の状態に戻せます</li>
          </ul>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-2">💡 よく使う指示の例：</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs">もっと丁寧な表現にして</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs">もう少し簡潔にまとめて</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs">具体的な数字を増やして</span>
            </div>
          </div>
        </div>
      </section>

      {/* ステップ5 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
          保存・エクスポートする
        </h3>
        <div className="space-y-4 text-slate-600">
          <p>完成した報告文は以下の方法で保存・出力できます：</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>履歴に保存</strong>：「この内容で履歴に保存する」ボタンで保存（ブラウザに保存されます）</li>
            <li><strong>テキストをコピー</strong>：クリップボードにコピーして他のアプリに貼り付け</li>
            <li><strong>CSV/TXTエクスポート</strong>：履歴画面から複数の報告文をまとめて出力</li>
          </ul>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-700">✅ 保存した履歴はブラウザに保存されるため、同じブラウザで再度アクセスすれば確認・編集できます。</p>
          </div>
        </div>
      </section>

      {/* 文章のトーン */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">★</span>
          文章のトーンについて
        </h3>
        <div className="space-y-4 text-slate-600">
          <p>6種類のトーンから選択できます：</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-bold text-slate-700">論理的・分析的</p>
              <p className="text-sm text-slate-500">数値や事実に基づいた客観的な表現</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-bold text-slate-700">情熱的・前向き</p>
              <p className="text-sm text-slate-500">意欲と期待感を込めた力強い表現</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-bold text-slate-700">丁寧・謙虚</p>
              <p className="text-sm text-slate-500">周囲への感謝と着実な歩みを感じさせる表現</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-bold text-slate-700">簡潔・実務的</p>
              <p className="text-sm text-slate-500">無駄を省き要点を最短で伝える表現</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-bold text-slate-700">独創的・柔軟</p>
              <p className="text-sm text-slate-500">新しい可能性を模索する自由な表現</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-bold text-slate-700">素朴・等身大</p>
              <p className="text-sm text-slate-500">飾らない素直な言葉で書いた自然な表現</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">Q</span>
          よくある質問
        </h3>
        <div className="space-y-6">
          <div>
            <p className="font-bold text-slate-700 mb-2">Q. 生成した文章は編集できますか？</p>
            <p className="text-slate-600 text-sm">はい、テキストエリアで自由に編集できます。また、AIへの追加指示で自動修正もできます。</p>
          </div>
          <div>
            <p className="font-bold text-slate-700 mb-2">Q. 履歴はどこに保存されますか？</p>
            <p className="text-slate-600 text-sm">ブラウザのローカルストレージに保存されます。別のブラウザやデバイスからはアクセスできません。</p>
          </div>
          <div>
            <p className="font-bold text-slate-700 mb-2">Q. 生成回数に制限はありますか？</p>
            <p className="text-slate-600 text-sm">特に制限はありませんが、短時間に大量に生成すると一時的に利用できなくなる場合があります。</p>
          </div>
          <div>
            <p className="font-bold text-slate-700 mb-2">Q. 生成された文章をそのまま提出して良いですか？</p>
            <p className="text-slate-600 text-sm">内容を確認し、必要に応じて修正してからご提出ください。AIが生成した文章は参考としてご利用ください。</p>
          </div>
        </div>
      </section>
    </div>
  );
};
