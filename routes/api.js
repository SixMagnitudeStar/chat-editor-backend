

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

router.get('/getCode', async(req, res)=> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const message = "請求內容是為了得到可以正確顯示網頁的html文本。回覆請遵守幾點："
                + "1. 以下回應給我能顯示在html的iframe標籤中的html文本就好，可以包含style和script，但不要包含說明文字。"
                + "2. 給我可以鑲入code或是iframe.srcdoc屬性中的純html，不要包含反引號markdown。"
                + "3. 如果我說背景要什麼圖片，直接用網路上公開的圖片網址作為背景圖片網址"
                + "4. 回傳字串內容以<!DOCTYPE html>開頭，/html>\n\n結尾"
                + "以下是想要的網頁內容:"
                + req.query.message;
  console.log('呼叫成功');
  if (message){
    try{
      console.log('訊息參數完整');
      //使用生成模型產生內容
      const result = await model.generateContent(message);
      const response = await result.response;

      const rawText = await response.text();
   
      let cleanText = rawText.replace(/`/g, ""); //移除所有反引號
      cleanText = cleanText.replace(/html\n/, "");//移除開頭的html\n/字串，讓回傳值符合<html>開頭</html>結尾

      res.json({ generatedText: cleanText});
      console.log(cleanText);

    }catch(error){
      //
      console.error("Error generating content:", error);
      res.status(500).json({message: 'Error generating content from Google Generative AI' });
    }
  }


})

module.exports = router;