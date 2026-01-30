
import { TrainingType, AITool, TrainingMaster } from './types';

export const TRAINING_MASTERS: TrainingMaster[] = [
  {
    id: 'tr-01',
    name: TrainingType.AI_PRACTICE,
    tools: [
      { id: 'chatgpt', name: 'ChatGPT', category: 'Text' },
      { id: 'writesonic', name: 'Writesonic', category: 'Text' },
      { id: 'canva-ai', name: 'Canva AI', category: 'Design' },
      { id: 'genspark', name: 'Genspark', category: 'Research' },
      { id: 'mapify', name: 'Mapify', category: 'Diagram' },
      { id: 'napkin-ai', name: 'Napkin AI', category: 'Diagram' },
      { id: 'chatgpt-canvas', name: 'ChatGPT Canvas', category: 'Text' },
      { id: 'tldv', name: 'tl;dv', category: 'Meeting' },
      { id: 'notion-ai', name: 'Notion AI', category: 'Knowledge' },
      { id: 'gpts', name: 'GPTs', category: 'Automation' },
    ]
  },
  {
    id: 'tr-02',
    name: TrainingType.VIDEO_PRODUCTION,
    tools: [
      { id: 'gpt-4o', name: 'GPT-4o', category: 'Text' },
      { id: 'copilot', name: 'Copilot', category: 'Text' },
      { id: 'adobe-firefly', name: 'Adobe Firefly', category: 'Image' },
      { id: 'midjourney', name: 'Midjourney', category: 'Image' },
      { id: 'runway-gen2', name: 'Gen2', category: 'Video' },
      { id: 'vrew', name: 'Vrew', category: 'Video' },
      { id: 'heygen', name: 'HeyGen', category: 'Video' },
      { id: 'capcut', name: 'CapCut', category: 'Video' },
      { id: 'canva-v', name: 'Canva', category: 'Design' },
      { id: 'immersity', name: 'Immersity AI', category: 'Video' },
      { id: 'suno', name: 'SunoAI', category: 'Audio' },
      { id: 'premiere', name: 'Adobe Premiere Pro', category: 'Video' },
    ]
  },
  {
    id: 'tr-03',
    name: TrainingType.OPERATIONAL_EFFICIENCY,
    tools: [
      { id: 'perplexity', name: 'Perplexity', category: 'Research' },
      { id: 'genspark-eff', name: 'Genspark', category: 'Research' },
      { id: 'gas', name: 'GAS', category: 'Automation' },
      { id: 'google-forms', name: 'Googleフォーム', category: 'Automation' },
      { id: 'chatgpt-eff', name: 'ChatGPT', category: 'Text' },
      { id: 'gamma-eff', name: 'Gamma', category: 'Diagram' },
      { id: 'heygen-eff', name: 'HeyGen', category: 'Video' },
      { id: 'coefont', name: 'CoeFont', category: 'Audio' },
      { id: 'sora', name: 'Sora', category: 'Video' },
      { id: 'suno-eff', name: 'Suno AI', category: 'Audio' },
    ]
  },
  {
    id: 'tr-04',
    name: TrainingType.AI_CULTURE,
    tools: [
      { id: 'chatgpt-cult', name: 'ChatGPT', category: 'Text' },
      { id: 'genspark-cult', name: 'Genspark', category: 'Research' },
      { id: 'irusiru', name: 'イルシル', category: 'Diagram' },
      { id: 'perplexity-cult', name: 'Perplexity', category: 'Research' },
      { id: 'claude', name: 'Claude', category: 'Text' },
      { id: 'gemini', name: 'Gemini', category: 'Text' },
      { id: 'notebooklm', name: 'NotebookLM', category: 'Knowledge' },
      { id: 'notion', name: 'Notion', category: 'Knowledge' },
    ]
  }
];

export const PERSONALITY_OPTIONS = [
  { id: 'logical', name: '論理的・分析的', desc: '数値や事実に基づいた客観的な表現' },
  { id: 'passionate', name: '情熱的・前向き', desc: '意欲と期待感を込めた力強い表現' },
  { id: 'polite', name: '丁寧・謙虚', desc: '周囲への感謝と着実な歩みを感じさせる表現' },
  { id: 'concise', name: '簡潔・実務的', desc: '無駄を省き要点を最短で伝える表現' },
  { id: 'creative', name: '独創的・柔軟', desc: '新しい可能性を模索する自由な表現' },
  { id: 'casual', name: '素朴・等身大', desc: '飾らない素直な言葉で書いた素人らしい自然な表現' },
];

export const REFINE_SUGGESTIONS = [
  'もっと丁寧な表現にして',
  'もう少し簡潔にまとめて',
  '具体的な数字を増やして',
  'もっとカジュアルな文体にして',
  '文章を短くして',
  '敬語を柔らかくして',
];

export const ROLE_OPTIONS: Record<string, { tasks: string[], issues: string[], applyTasks: string[], applyMethods: string[], jobFlowExample: string, issuesExample: string }> = {
  '営業': {
    tasks: ['顧客開拓', 'ヒアリング', '見積作成', '契約締結', '案件管理', '顧客フォロー'],
    issues: ['提案資料作成に時間がかかる', 'ヒアリング漏れが発生する', '案件管理が属人化している', '適切な商品選定に迷う'],
    applyTasks: ['商談準備の効率化', 'パーソナライズされた提案', 'ロールプレイング実施', '議事録の即時作成'],
    applyMethods: ['顧客情報の要約プロンプト', '提案骨子生成ツールの活用', '過去失注理由の分析', 'FAQの自動生成'],
    jobFlowExample: '顧客リストからターゲットを選定し、架電・訪問にてヒアリングを行います。その後、課題に合わせた提案書と見積書を作成し、プレゼンテーションを経て契約を締結します。',
    issuesExample: '競合他社との差別化ポイントを資料に落とし込む作業が属人化しており、若手社員の提案クオリティが安定しない。',
  },
  '技術・設計': {
    tasks: ['現地調査', '図面作成', '照明選定', '照度計算', '器具選定', '仕様確認'],
    issues: ['カタログ選定の工数が大きい', '設計品質に個人差がある', '手戻りが頻繁に発生する', '最新仕様の把握が困難'],
    applyTasks: ['器具選定の自動化', '照度シミュレーション補完', '仕様書作成の迅速化', '技術ナレッジの共有'],
    applyMethods: ['選定基準のプロンプト化', 'カタログデータの学習', '図面チェックの自動化', '技術マニュアルの動画化'],
    jobFlowExample: '営業から共有された案件概要を基に現地調査を行い、既存設備の状況を確認します。そのデータを基に照明配置図の作成と照度計算を行い、最適な器具選定と見積作成を行います。',
    issuesExample: '数千ページに及ぶ最新カタログから、顧客の特殊な要望（調光機能や演色性）を満たす器具を特定するのに膨大な時間がかかっている。',
  },
  '工事管理': {
    tasks: ['現場調査', '工程表作成', '施工管理', '協力会社調整', '安全管理', '現場写真整理', '工事説明'],
    issues: ['工程表作成の負担が大きい', '現場説明が伝わりにくい', '写真整理が後回しになる', '安全教育の形骸化'],
    applyTasks: ['工程表の自動生成', '工事説明動画の作成', '写真仕分けの自動化', '安全資料の視覚化'],
    applyMethods: ['指定ルールに基づく工程出力', '現場写真のAI解析', '作業手順の動画マニュアル', '安全指示書のAI要約'],
    jobFlowExample: '確定した図面と工程表を確認し、必要な資材の発注と協力会社の手配を行います。現場では安全管理と進捗管理を行い、日報作成や完了写真の整理を日々進めます。',
    issuesExample: '現場ごとの特有な安全注意事項が協力会社に徹底されず、毎朝の朝礼での指示出しが形骸化してリスクの火種になっている。',
  },
  '事務・総務': {
    tasks: ['データ入力', '資料作成', '請求書処理', '電話応対', 'スケジュール管理', '備品管理'],
    issues: ['定型業務の繰り返しが多い', 'データの転記ミスが発生する', '問い合わせ対応の負荷', 'マニュアルが古い'],
    applyTasks: ['データ入力の自動化', '問い合わせ一次対応', '資料の自動構成', '社内規程の即時検索'],
    applyMethods: ['スプレッドシート自動化', 'AIチャットボット構築', '音声入力による起票', 'PDFマニュアルのAI検索'],
    jobFlowExample: '各部署から提出される経費精算書類の内容をチェックし、会計システムへデータを入力します。不備がある場合は担当者へ差し戻し、月次決算に間に合うようスケジュール管理を行います。',
    issuesExample: '社内規程に関する似たような問い合わせが電話やメールで頻発し、本来集中すべき決算業務が細切れに中断されてしまう。',
  },
  '企画・マーケティング': {
    tasks: ['市場調査', 'プロジェクト立案', 'プレゼン資料作成', '効果測定', 'SNS運用'],
    issues: ['アイデアが枯渇しやすい', '調査データの分析に時間がかかる', '資料のビジュアル化が苦手', 'トレンド把握が遅れる'],
    applyTasks: ['企画立案のブレスト', '競合調査の自動化', 'ビジュアル資料の生成', '多言語展開の迅速化'],
    applyMethods: ['多角的視点プロンプト', 'Web検索AIによる競合分析', 'AIによるデザイン生成', 'トレンド記事の要約'],
    jobFlowExample: 'SNSの分析ツールを用いて昨月の反響を確認し、次月の投稿キャンペーンを企画します。ターゲット層に響くキャッチコピーとビジュアル案を策定し、広告代理店と調整して入稿作業を行います。',
    issuesExample: '新商品のターゲット層に対する深いインサイト分析が不足しており、打ち出すキャッチコピーが過去の類似事例の焼き直しになりがちである。',
  },
  '制作・デザイン': {
    tasks: ['動画制作', '画像加工', 'スライドデザイン', 'コンテンツ構成', 'キャッチコピー作成'],
    issues: ['制作工数の増大', 'クオリティのムラ', 'フィードバックの反映に時間がかかる', '素材探しに手間取る'],
    applyTasks: ['初稿・プロトタイプ作成', '素材の自動生成・加工', '多媒体へのリサイズ', '動画テロップの自動化'],
    applyMethods: ['AI画像生成による素材作成', '自動字幕生成ツールの活用', 'デザインパターンの提案', 'アバターによる解説動画'],
    jobFlowExample: 'クライアントからのオリエン資料を読み込み、コンセプト設計と構成案を作成します。素材の選定・加工を行い、動画編集ソフトを用いてテロップ入れや効果音の調整を行い、初稿を納品します。',
    issuesExample: 'クライアントからの曖昧な修正指示（もっと明るい感じで、等）の解釈にズレが生じ、何往復もの手戻りが発生して納品スケジュールを圧迫している。',
  },
};

export const CATEGORY_LEARNING_POINTS: Record<string, string[]> = {
  'Text': ['プロンプトエンジニアリング', 'ロール指定による精度向上', '要約・抽出テクニック', '論理構成の自動作成', 'Excel関数の生成'],
  'Research': ['リアルタイム情報の検索', 'エビデンスの特定', '競合比較表の自動生成', '情報の信頼性確認手法'],
  'Video': ['台本・構成の自動生成', 'アバターによる解説', '自動字幕・翻訳フロー', '動画内製化の手順'],
  'Image': ['プロンプトによる画像生成', '画像の一部改変・修正', '背景削除と合成', '著作権への配慮事項'],
  'Diagram': ['図解の自動生成', 'マインドマップ化', 'スライド構成の自動化', 'インフォグラフィック化'],
  'Automation': ['Google Apps Script (GAS) による業務自動化', 'カスタムGPTsの構築', 'AIによるプログラムコード生成', 'ワークフローの統合'],
  'Knowledge': ['ナレッジベースの構築', '社内情報のAI検索', 'ドキュメントの一元管理', 'AI活用ガイドライン'],
  'Design': ['AIによるデザイン生成', 'テンプレート活用による時短', 'ブランド素材の統一管理', 'プレゼン資料の自動レイアウト'],
  'Audio': ['AI音声合成によるナレーション作成', 'BGM・効果音の自動生成', '多言語音声の自動生成', '音声コンテンツの内製化'],
  'Meeting': ['会議の自動文字起こし', '議事録の自動要約', '重要アクションの抽出', '会議内容の多言語翻訳'],
};

export const SYNONYM_MAP: Record<string, string[]> = {
  '活用する': ['活かす', '適用する', '取り入れる', '運用に組み込む', '実践する'],
  '効率化': ['省力化', '工数削減', '作業短縮', '簡略化', 'スピードアップ'],
  'ばらつき': ['属人差', '判断差', '品質のムラ', '個人による精度の差'],
  '迅速に': ['速やかに', 'スムーズに', '遅滞なく', '即座に'],
  '作成する': ['構築する', 'アウトプットする', 'まとめる', '生成する'],
  '説明する': ['案内する', 'イメージを共有する', 'プレゼンする'],
};

export const BANNED_PHRASES: Record<string, string> = {
  '革新的': '大きな',
  '劇的': '大幅な',
  '完全に': '概ね',
  '必ず': '目標として',
};
