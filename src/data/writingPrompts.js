export const WRITING_PROMPTS = [
  "What brought you an unexpected moment of peace or quiet gratitude today?",
  "Describe a subtle detail you observed today that someone in a hurry would have missed.",
  "What is one feeling or worry that you are ready to gently let go of right now?",
  "If today was a chapter in a book, what title would you give it, and why?",
  "Who crossed your mind today in a warm or fond way?",
  "What is one small kindness you witnessed, gave, or received today?",
  "Reflect on a choice you made today that honored your energy and boundaries.",
  "What made you smile or pause with wonder during the day?",
  "What does your mind or body need most as this day draws to a close?",
  "Write about something that felt difficult recently, and what it is teaching you."
];

export const getRandomPrompt = (excludePrompt = '') => {
  const filtered = WRITING_PROMPTS.filter(p => p !== excludePrompt);
  const pool = filtered.length > 0 ? filtered : WRITING_PROMPTS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};
