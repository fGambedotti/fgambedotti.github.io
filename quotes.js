// ============================================================
// Federico Gambedotti - Quotes
// "If you looked at my secret notes today you would see..."
//
// 50 quotes: 30 original (FG), 20 attributed.
// Rotation logic: uses today's date as seed so every visitor
// sees the same quote on the same day. Feels curated, not random.
// ============================================================

const QUOTES = [
  // - ORIGINAL - Federico Gambedotti
  {
    text: "The algorithm is either above you or below you. You either use it or it uses you. The same is true of society.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Be a builder in a world of consumers.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Let your progress be discovered rather than announced.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "We assume poor people cannot offer energy flexibility. But poor people tend to live in dense urban areas - the places most capable of generating it. Exclusion is a design choice, not an inevitability.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "The era of pure software is over. We are entering the era of assets: AI, energy, and the physical world.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Wages are the contract for difference of workers. The question is whether you deliver above or below the strike price.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "We need to grow GDP per capita, not GDP. One measures prosperity. The other just measures size.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Inflation is the most regressive tax ever invented. That is why the poorer you are, the more you need assets.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Detailed enough to be useful. Simple enough to be memorable.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Saying no is a superpower.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Pain is a stimulus for change.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Most problems in life have already been solved. Sometimes the most intelligent thing you can do is copy what works.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Are your priorities and your actions aligned? If not, your priorities are not really your priorities.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "What are you going to thank your today self for, five years from now?",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "People are either batteries or vacuums. Choose your room accordingly.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Never beg for a seat at the table. Build your own.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "If not you, who? If not now, when?",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Start today. If you don't, you will be doing the same things ten years from now.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Learning never stops - but at some point you have to act. Learn, execute, reflect, repeat.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Ready, fire, aim. Consistency doesn't create great things - speed and iteration do.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Competence is confidence. The two cannot be separated.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Your success is a function with you as the variable - not others. Focus on you.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Could you do that a week ago? Then you are making progress. Progress is often invisible until it isn't.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Work unreasonably hard, unreasonably long, and develop one critical skill that nobody can take from you.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "The systems around us took centuries to design. AI gives each of us the chance to redesign them - faster and better.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Don't introduce yourself with your job title. That is not who you are. You are the set of skills you have chosen to develop and enjoy applying.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "The box trap: your sunk cost feels so large that you cannot walk away to start something better. Recognise the trap. Walk away.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "Harvest what you have worked for. Hunt the next opportunity. Always proud, never satisfied.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "AI and net zero are not separate agendas. They are the same civilisational question: who controls the energy, and who benefits from it.",
    author: "Federico Gambedotti",
    original: true
  },
  {
    text: "The systems that run our world were designed. They can be redesigned.",
    author: "Federico Gambedotti",
    original: true
  },

  // - ATTRIBUTED
  {
    text: "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.",
    author: "Buckminster Fuller",
    original: false
  },
  {
    text: "The purpose of a system is what it does.",
    author: "Stafford Beer",
    original: false
  },
  {
    text: "The smart way to keep people passive and obedient is to strictly limit the spectrum of acceptable opinion, but allow very lively debate within that spectrum.",
    author: "Noam Chomsky",
    original: false
  },
  {
    text: "Wealth consists not in having great possessions, but in having few wants.",
    author: "Epictetus",
    original: false
  },
  {
    text: "When the facts change, I change my mind. What do you do?",
    author: "John Maynard Keynes",
    original: false
  },
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    original: false
  },
  {
    text: "The most common way people give up their power is by thinking they don't have any.",
    author: "Alice Walker",
    original: false
  },
  {
    text: "The future is already here - it's just not evenly distributed.",
    author: "William Gibson",
    original: false
  },
  {
    text: "Every system is perfectly designed to get the results it gets.",
    author: "W. Edwards Deming",
    original: false
  },
  {
    text: "The greatest danger in times of turbulence is not the turbulence - it is to act with yesterday's logic.",
    author: "Peter Drucker",
    original: false
  },
  {
    text: "What is it that you believe that nobody else believes?",
    author: "Peter Thiel",
    original: false
  },
  {
    text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.",
    author: "Abraham Lincoln",
    original: false
  },
  {
    text: "A small group of thoughtful, committed citizens can change the world; indeed, it is the only thing that ever has.",
    author: "Margaret Mead",
    original: false
  },
  {
    text: "Power concedes nothing without a demand. It never did and it never will.",
    author: "Frederick Douglass",
    original: false
  },
  {
    text: "The trouble with the world is that the stupid are cocksure and the intelligent are full of doubt.",
    author: "Bertrand Russell",
    original: false
  },
  {
    text: "The world will come and ask you who you are. And if you don't know, it will tell you.",
    author: "Carl Jung",
    original: false
  },
  {
    text: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
    original: false
  },
  {
    text: "Poverty is not an accident. Like slavery and apartheid, it is man-made and can be removed by the actions of human beings.",
    author: "Nelson Mandela",
    original: false
  },
  {
    text: "Energy is the only universal currency: one of its many forms must be transformed to get anything done.",
    author: "Vaclav Smil",
    original: false
  },
  {
    text: "The good we secure for ourselves is precarious and uncertain until it is secured for all of us.",
    author: "Jane Addams",
    original: false
  }
];

// - ROTATION LOGIC
// Same quote for all visitors on the same calendar day.
// Change QUOTES_VERSION to force a reset if you update the list.
const QUOTES_VERSION = 1;
let baseQuoteIndex = 0;
let quoteOffset = 0;

function getQuoteIndexOfTheDay() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate() + QUOTES_VERSION;
  return seed % QUOTES.length;
}

function getQuoteOfTheDay() {
  return QUOTES[getQuoteIndexOfTheDay()];
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// - RENDER
function renderQuoteAtIndex(index, isExtraQuote) {
  const container = document.getElementById('quote-section');
  if (!container) return;

  const quote = QUOTES[index];
  const isOriginal = quote.original;
  const returnText = isExtraQuote ? 'Want another? Keep going.' : 'Come back tomorrow for another.';

  container.innerHTML = `
    <div class="quote-eyebrow">
      If you looked at my secret notes today you would see&hellip;
    </div>
    <blockquote class="quote-text">
      &ldquo;${escapeHtml(quote.text)}&rdquo;
    </blockquote>
    <div class="quote-attribution">
      <span class="quote-dash">&mdash;</span>
      <span class="quote-author">${escapeHtml(quote.author)}</span>
      ${isOriginal ? '<span class="quote-badge">Original</span>' : ''}
    </div>
    <div class="quote-actions">
      <div class="quote-return">${returnText}</div>
      <button class="quote-more-btn" type="button" data-quote-more>I want one more quote</button>
    </div>
  `;
}

function renderQuoteOfTheDay() {
  const container = document.getElementById('quote-section');
  if (!container) return;

  baseQuoteIndex = getQuoteIndexOfTheDay();
  quoteOffset = 0;
  renderQuoteAtIndex(baseQuoteIndex, false);

  container.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-quote-more]');
    if (!trigger) return;

    quoteOffset = (quoteOffset + 1) % QUOTES.length;
    const nextIndex = (baseQuoteIndex + quoteOffset) % QUOTES.length;
    renderQuoteAtIndex(nextIndex, true);
  });
}

document.addEventListener('DOMContentLoaded', renderQuoteOfTheDay);
