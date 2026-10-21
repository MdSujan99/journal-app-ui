export const MOODS = [
  { id: 'peaceful', label: 'Peaceful', icon: '🕊️', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'grateful', label: 'Grateful', icon: '🌿', color: 'bg-sage-light text-sage-dark border-sage-border' },
  { id: 'reflective', label: 'Reflective', icon: '☕', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'energized', label: 'Energized', icon: '☀️', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { id: 'inspired', label: 'Inspired', icon: '✨', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { id: 'melancholy', label: 'Melancholy', icon: '🌧️', color: 'bg-blue-50 text-blue-800 border-blue-200' },
];

export const MOCK_ENTRIES = [
  {
    id: "entry-1",
    title: "The quiet rhythm of an autumn morning",
    date: "2026-10-18T08:30:00.000Z",
    mood: "peaceful",
    tags: ["Morning", "Mindfulness", "Seasons"],
    isFavorite: true,
    prompt: "Describe a subtle detail you observed today that someone in a hurry would have missed.",
    content: `Woke up before the alarm today. The light coming through the blinds was soft and amber-tinted, filtering through the maple tree that has almost entirely turned to copper.

Took my time making black tea with a touch of cardamom. Sat by the south window without opening my laptop or checking notifications. There is something grounding about watching the steam swirl upwards in absolute silence.

I noticed how the morning dew sat perfectly poised on the spider web suspended between the garden fence and the rosemary bush. Someone rushing to catch their train would have brushed right past it, but for three quiet minutes, it felt like the most intricate sculpture in the neighborhood.

Intention for today: carry this unhurried pace into my afternoon meetings.`
  },
  {
    id: "entry-2",
    title: "Walking through the old pine trail",
    date: "2026-10-17T16:45:00.000Z",
    mood: "reflective",
    tags: ["Nature", "Solitude", "Thoughts"],
    isFavorite: false,
    prompt: "What is one feeling or worry that you are ready to gently let go of right now?",
    content: `Took the trail behind the community reservoir after work. The ground was cushioned with dry pine needles, crackling gently underfoot with each step.

I spent most of the walk untangling thoughts about upcoming deadlines. It's easy to build an imaginary mountain out of what is really just a series of small, manageable stones. Once I reached the clearing where the lake opens up, the wind picked up and carried away the mental clutter.

I don't have to resolve every question this week. Some clarity arrives only after you give things room to breathe.`
  },
  {
    id: "entry-3",
    title: "A handwritten letter and simple pleasures",
    date: "2026-10-15T19:20:00.000Z",
    mood: "grateful",
    tags: ["Gratitude", "Connection", "Home"],
    isFavorite: true,
    prompt: "Who crossed your mind today in a warm or fond way?",
    content: `Found a postcard in the mailbox from Elena from Kyoto. Just three sentences written in fountain pen ink on thick washi paper:
"Thinking of our tea shop talks. The ginkgo trees are glowing gold here. Sending quiet warmth."

It reminded me how rare and cherished tangible correspondence feels now. I ended up sitting at my desk, pulling out the cream stationery I bought last winter, and writing back three letters to old friends. 

Dinner was simple: toasted sourdough, tomato soup with cracked pepper, and jazz playing softly in the kitchen. A gentle, nourishing evening.`
  },
  {
    id: "entry-4",
    title: "A sudden spark of inspiration for Daybook",
    date: "2026-10-12T14:15:00.000Z",
    mood: "inspired",
    tags: ["Creative", "Ideas", "Design"],
    isFavorite: true,
    prompt: "If today was a chapter in a book, what title would you give it, and why?",
    content: `Chapter title: "The Return of Plain Canvas."

Most software today demands your attention with screaming red badges, flashing counters, and infinite feeds. Journaling shouldn't feel like another task on a productivity checklist. It should feel like stepping into a wood-paneled reading room with linen curtains.

Sketched out principles for a calm space:
• Warm ivory tones instead of clinical harsh white
• Generous whitespace that lets words breathe
• Prompts that ask gentle questions, not demanding homework
• A sense of permanence and privacy

When the space feels calm, the thoughts flow naturally.`
  }
];
