
import { GoogleGenAI } from "@google/genai";
import { FormData, LengthType } from "../types";
import { PERSONALITY_OPTIONS, TRAINING_MASTERS, CATEGORY_LEARNING_POINTS } from "../constants";

const CATEGORY_LABELS: Record<string, string> = {
  'Text': 'テキスト生成・文章作成AI',
  'Research': 'AI検索・リサーチツール',
  'Video': '動画制作・編集AI',
  'Image': '画像生成・加工AI',
  'Diagram': '図解・スライド作成AI',
  'Automation': '業務自動化・プログラミングツール',
  'Knowledge': 'ナレッジ管理・情報整理AI',
  'Audio': '音声・音楽生成AI',
  'Design': 'デザイン支援AI',
  'Meeting': '会議支援・議事録AI',
};

function buildToolDescription(data: FormData): string {
  const allToolIds = [data.mainTool, ...data.additionalTools].filter(Boolean);
  const training = TRAINING_MASTERS.find(t => t.name === data.trainingType);
  if (!training) return '';

  const descriptions = allToolIds.map(toolName => {
    const tool = training.tools.find(t => t.name === toolName);
    if (!tool) return `- ${toolName}`;
    const categoryLabel = CATEGORY_LABELS[tool.category] || tool.category;
    const capabilities = CATEGORY_LEARNING_POINTS[tool.category];
    const capStr = capabilities ? `（主な機能: ${capabilities.join('、')}）` : '';
    return `- ${tool.name}: ${categoryLabel}${capStr}`;
  });

  return descriptions.join('\n    ');
}

export const polishText = async (
  baseDraft: string,
  data: FormData,
  length: LengthType,
  variantId: number
): Promise<string> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API key not found");
    return baseDraft;
  }
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.0-flash";
  
  const lengthPrompt = {
    standard: "280文字から420文字程度",
    long: "450文字から650文字程度"
  }[length];

  const personality = PERSONALITY_OPTIONS.find(p => p.id === data.personality) || PERSONALITY_OPTIONS[0];

  const allTools = [data.mainTool, ...data.additionalTools].filter(Boolean).join("、");
  const toolDescriptions = buildToolDescription(data);

  const systemInstruction = `
    あなたは企業の「訓練実施報告書」の文章生成エキスパートです。
    ユーザーが入力した情報を元に、自然で実務的な日本語で「6 内容（学んだこと、今後の活かし方）」欄の文章を作成してください。

    【指定された性格・文章スタイル】
    ${personality.name}: ${personality.desc}

    【使用AIツールの正確な情報（必ずこの情報に基づいて記述すること）】
    ${toolDescriptions}
    ※ 上記のカテゴリと機能に厳密に従ってください。テキスト生成AIを画像生成AIと記述したり、動画制作AIをリサーチツールと記述するなど、ツールの種類と機能を取り違えないでください。

    【文章のトーン・マナー】
    - 実直で誠実なビジネス文書（過剰な美辞麗句は不要）。
    - 例文の要点（現状の苦労→研修での具体的気づき→具体的な改善アクション→期待する結果）を必ず押さえてください。
    - 現場感のある具体的な描写（複数の資料を確認する手間、属人化の解消、動画による視覚的説明など）を重視してください。
    - バリエーションID ${variantId} に基づき、毎回表現の語尾や接続詞を工夫し、画一的なテンプレ感を払拭してください。

    【厳守ルール】
    1. 誇張した表現（革新的、劇的、劇的な変化など）は「大幅な」「確実な」等に言い換える。
    2. 断定を避け「〜を目指す」「〜を見込む」「〜できるようになる」「〜だと感じた」等、主観と客観を混ぜる。
    3. 同一の接続詞（〜することで等）の連続禁止。
    4. 指定された文字数を厳守：${lengthPrompt}。
    5. 使用ツール（${allTools}）の実名と、上記で定義された正確な機能を自然に組み込む。各ツールの機能は上記カテゴリに基づき、他ツールの機能と混同しないこと。
    6. 「承知しました」「以下が文章です」などの前置きや説明は一切不要。報告文の本文のみを出力すること。
  `;

  const finalRole = data.jobRole === 'その他' ? data.jobRoleOther : data.jobRole;

  const prompt = `
    以下の下書きを、指定されたスタイル「${personality.name}」でリライトしてください。
    
    【下書き】
    ${baseDraft}
    
    【入力情報】
    - 役割: ${finalRole}
    - 使用ツール: ${allTools}
    - 業務フロー: ${data.jobFlow}
    - 課題: ${[...data.issues, data.issuesOther].filter(Boolean).join(", ")}
    - 学び: ${[...data.learningPoints, data.learningPointsOther].filter(Boolean).join(", ")}
    - 活用法: ${[...data.applyTasks, data.applyTasksOther].filter(Boolean).join(", ")}
    - 手法: ${[...data.applyMethods, data.applyMethodsOther].filter(Boolean).join(", ")}
    - 目標: ${data.kpiType} を ${data.kpiValue}${data.kpiUnit} 改善
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.92,
      },
    });

    return response.text || baseDraft;
  } catch (error) {
    console.error("Gemini Error:", error);
    return baseDraft;
  }
};

export const refineTextWithInstruction = async (
  currentText: string,
  instruction: string,
  data: FormData
): Promise<string> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API key not found");
    return currentText;
  }
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.0-flash";
  
  const personality = PERSONALITY_OPTIONS.find(p => p.id === data.personality) || PERSONALITY_OPTIONS[0];

  const systemInstruction = `
    あなたは企業の「訓練実施報告書」の文章生成エキスパートです。
    現在の文章に対して、ユーザーからの追加指示を反映させてリライトしてください。
    
    【厳守事項】
    - ビジネス文書としての品位を保つこと。
    - 以前のコンテキスト（${data.mainTool}の使用、${data.jobRole}としての役割など）を維持すること。
    - 修正後の文章のみを出力してください。「承知しました」などの前置きは不要。
    - 性格設定（${personality.name}）を尊重してください。
    - AI特有の過剰な表現は自動的に抑制してください。
  `;

  const prompt = `
    現在の文章:
    "${currentText}"

    ユーザーからの追加指示:
    "${instruction}"

    上記指示に基づき、文章を修正してください。
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || currentText;
  } catch (error) {
    console.error("Gemini Refinement Error:", error);
    return currentText;
  }
};
