
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

// 初始化 Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// 設置路由處理器
router.get('/generate-story', async (req, res) => {
  try {
    // 取得 Google Generative Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Write a story about a magic backpack.";

    // 使用生成模型產生內容
    const result = await model.generateContent(prompt);

    // 取得並返回生成的文本
    const response = await result.response;
    const text = await response.text();  // 使用 await 確保正確獲取結果

    res.json({ generatedText: text });  // 將生成的文本返回給前端

  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: 'Error generating content from Google Generative AI' });
  }
});

module.exports = router;