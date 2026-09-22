import express from 'express';
import { handleCounselorChat } from '../services/aiCounselorService.js';

const router = express.Router();

// POST /api/ai/chat - Interactive AI CounselChat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const aiResponse = await handleCounselorChat(message, context);
    res.json({
      success: true,
      message: aiResponse.reply,
      source: aiResponse.source
    });
  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process AI chat response: ' + error.message,
      message: "I am having trouble accessing the counselling engine right now. Please check your cutoff and profile details on the dashboard."
    });
  }
});

export default router;
