/**
 * STRICT DOMAIN KNOWLEDGE BASE
 * Only answers found here will be returned by the AI.
 */

exports.knowledgeBase = [
    // --- GREETINGS ---
    {
        intent: 'greeting',
        keywords: ['hi', 'hello', 'hey', 'start', 'good morning', 'good evening', 'help'],
        response: "Hello! I'm your Reservice assistant. I can help you with booking services, checking prices, or tracking your order. What do you need help with?"
    },
    {
        intent: 'identity',
        keywords: ['who are you', 'what are you', 'your name', 'are you a bot', 'real person'],
        response: "I am the Reservice automated assistant. I'm here to answer questions about our home services and help you with your bookings."
    },

    // --- SERVICES ---
    {
        intent: 'services_general',
        keywords: ['what services', 'list services', 'what do you do', 'available services', 'offer'],
        response: "We offer a wide range of home services including AC Repair, Plumbing, Electrical, House Shifting, Cleaning, Painting, and more. You can view the full list on the Home screen."
    },
    {
        intent: 'service_plumbing',
        keywords: ['plumbing', 'plumber', 'leak', 'pipe', 'tap', 'drain'],
        response: "Our expert plumbers can fix leaks, install taps, and unclog drains. Pricing starts at ₹199 for a visitation/diagnosis fee."
    },
    {
        intent: 'service_electrical',
        keywords: ['electric', 'electrician', 'light', 'fan', 'switch', 'wiring', 'short circuit'],
        response: "Our certified electricians handle everything from fan installation to house wiring. Visit charges start at ₹199."
    },
    {
        intent: 'service_ac',
        keywords: ['ac', 'air conditioner', 'cooling', 'service ac', 'ac repair'],
        response: "We look cooler than your AC! But if yours isn't working, our experts can fix it. We offer servicing, gas charging, and repairs."
    },
    {
        intent: 'service_shifting',
        keywords: ['shift', 'moving', 'packers', 'movers', 'relocation', 'house shifting'],
        response: "Moving house? We offer professional House Shifting services. The final price depends on the distance and items. A consultation booking (₹199) is required for a final quote."
    },

    // --- PRICING ---
    {
        intent: 'pricing_general',
        keywords: ['price', 'cost', 'how much', 'rates', 'charge', 'expensive'],
        response: "Our base visitation fee is ₹199 for most services. The final cost depends on the parts needed and the complexity of the work, which the expert will confirm after inspection."
    },
    {
        intent: 'pricing_hidden',
        keywords: ['hidden charges', 'extra cost', 'transparency'],
        response: "We believe in transparency. You only pay for the approved quote. There are no hidden charges, though material costs are extra if parts need replacement."
    },

    // --- BOOKING ---
    {
        intent: 'how_to_book',
        keywords: ['how to book', 'make a booking', 'schedule', 'appointment'],
        response: "It's easy! Just select a category on the Home screen, choose your service, and click 'Book Now'. You can pick a convenient date and time slot."
    },
    {
        intent: 'cancellation',
        keywords: ['cancel', 'cancellation', 'refund'],
        response: "You can cancel your booking from the 'Bookings' tab. Cancellations made 2 hours before the scheduled time are fully refundable."
    },
    {
        intent: 'track_order',
        keywords: ['track', 'status', 'where is my', 'technician'],
        response: "You can track your service status in the 'Bookings' tab. We'll also send you notifications when your expert is on the way."
    },

    // --- SUPPORT ---
    {
        intent: 'contact_support',
        keywords: ['support', 'customer care', 'call', 'phone number', 'human'],
        response: "You can reach our customer support team at support@reservice.com or call us at 1800-RESERVICE (9 AM - 9 PM)."
    },

    // --- EASTER EGGS / FALLBACK CONTEXT ---
    {
        intent: 'joke',
        keywords: ['joke', 'funny'],
        response: "Why did the electrician get shocked? He didn't see the current situation coming! But seriously, let's keep your home safe."
    }
];

exports.fallbackResponse = "I'm sorry, I can only answer questions related to Reservice's home services, bookings, and policies. Please ask about a service or your order.";
