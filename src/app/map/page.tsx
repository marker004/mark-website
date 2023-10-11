"use client";

import { Map } from "@/components/map";

export default function map() {
  const copy = {
    headline: "Dad's Bike Trip",
    body: [
      `My father passed away in February 2019 from Early Onset Alzheimer's Disease. He was an incredible man in a lot of ways.
      In 1981, he took 3 months and rode his bicycle across the continental United States, from Washington state, to his home state of New Hampshire.
      During this time he wrote a journal of his travels. A lot of it was about the trip itself: the sights, the people, the feeling of riding a bike
      over the Rocky Mountains and the Great Plains. But a lot of it was very personal: his spirituality, past relationships, family, goals, and dreams.`,
      `As part of my grieving process during the pandemic spring of 2020, I read through the journal and tried to plot every location he stayed on the
      way on Google My Maps, as well as the routes he traveled between them. I did the best I could, but sometimes he didn't leave an exact location. At other points,
      I discovered that the roads have changed over the last 40 years and his original route was no longer mappable.`,
      `I quickly discovered that there are limitations to how many points can be plotted in a single Google My Map, so this project was born.
      Essentially it stitches together multiple KML (Keyhole Markup Language) files together using the Google Maps Javascript API.`,
      `There were multiple challenges to figure out in this project. My original plan was to simply save the Map KML files (there ended up being 9 of them)
      in a Google Drive folder and use the Google Drive API to fetch and display those. That way I could preserve a single source of truth,
      and any updates made in the maps would automatically propogate to this project. This approach actually worked perfectly for the first few KML files,
      but after a while it suddenly stopped working. There were intermittent errors connecting the kml files to the map.
      I never figured out the exact cause, only that it started happening after about 5 kml files were added, regardless of which files they were.
      I eventually ended up hosting those files myself, and the intermittent errors stopped happening.`,
    ],
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <section>
        <h1 className="text-4xl mb-3">{copy.headline}</h1>
        {copy.body.map((paragraph) => (
          <p className="mb-2" key={paragraph}>
            {paragraph}
          </p>
        ))}
        <p></p>
      </section>
      <Map className="mt-8" apiKey={apiKey as string} />
    </>
  );
}
