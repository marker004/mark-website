"use client";

import { Crossword } from "@/components/crossword";

export default function crosswords() {
  const copy = {
    headline: "Crosswords",
    body: [
      `I always been interested at crosswords. When I was a kid, it seemed impossible that someone could assemble all these letters in the correct places and finish the puzzle.
      As a young adult, I tried doing the crosswords in my roommate's physically delivered copies of the New York Times, to very little avail.
      When my dad started showing signs of memory loss (later diagnosed as Alzheimer's Disease), so I bought him some crossword books, since I had read that puzzles are good for mental acuity.`,
      `Then during the pandemic, a friend told me he thought I'd be good at crosswords and asked me to do one with him. Since that day in August 2020,
      I have done at least one crossword puzzle per day, sometimes up to 5 (which, as it turns out, is too many crosswords per day). Something about it finally clicked, and now I absolutely love it.
      I love the wordplay in the clues and the genius of a tricky theme. I particularly enjoy Thursdays :)`,
      `During the paternity leave after my daughter was born, early in 2022, I constructed my first crossword, which adheres to the basic technical specs of a New York Times crossword.`,
    ],
  };

  return (
    <>
      <section>
        <h1 className="text-4xl mb-3">{copy.headline}</h1>
        {copy.body.map((paragraph) => (
          <p className="mb-2" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </section>
      <Crossword />
    </>
  );
}
