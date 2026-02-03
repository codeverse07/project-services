const aiService = require('../services/aiService');

exports.chat = async (req, res, next) => {
    try {
        const { message } = req.body;

        const result = aiService.chat(message);

        // Simulate a slight "thinking" delay for realism (optional, remove for speed)
        // await new Promise(resolve => setTimeout(resolve, 500)); 

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};
