const { knowledgeBase, fallbackResponse } = require('../data/aiKnowledgeBase');

class AIService {
    /**
     * Process a user message and return the best matching response.
     * @param {string} userMessage 
     * @returns {Object} { message, intent, confidence }
     */
    chat(userMessage) {
        if (!userMessage) {
            return { message: "Please ask a question.", intent: 'empty', confidence: 0 };
        }

        const normalizedInput = userMessage.toLowerCase().trim();

        let bestMatch = null;
        let maxScore = 0;

        // Simple scoring algorithm
        // 1. Exact phrase match (Highest)
        // 2. Keyword density (Medium)

        for (const entry of knowledgeBase) {
            let score = 0;

            // Check each keyword
            entry.keywords.forEach(keyword => {
                const normalizedKeyword = keyword.toLowerCase();

                // Exact full match adds massive points
                if (normalizedInput === normalizedKeyword) {
                    score += 100;
                }
                // Input contains keyword
                else if (normalizedInput.includes(normalizedKeyword)) {
                    // Weigh longer keywords higher (e.g. "ac repair" > "ac")
                    score += 10 + (normalizedKeyword.length * 2);
                }
            });

            if (score > maxScore) {
                maxScore = score;
                bestMatch = entry;
            }
        }

        // Confidence Threshold
        // E.g. At least one significant keyword match (score > 10)
        if (bestMatch && maxScore >= 10) {
            return {
                message: bestMatch.response,
                intent: bestMatch.intent,
                confidence: maxScore
            };
        }

        return {
            message: fallbackResponse,
            intent: 'fallback',
            confidence: 0
        };
    }
}

module.exports = new AIService();
