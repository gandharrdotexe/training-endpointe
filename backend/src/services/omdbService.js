const prisma = require("../config/db");

async function syncMoviesFromOmdb(keyword = "batman") {
  const apiKey = process.env.OMDB_API_KEY || "demo";
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${keyword}`;
  
  const externalResponse = await fetch(url);
  const externalData = await externalResponse.json();
  const list = externalData.Search || [];

  // BUG fix: Fully await the createMany operation so it completes before response is returned.
  // Note: we preserve the database schema structure but fix the missing await.
  const result = await prisma.movie.createMany({
    data: list.map((item) => ({
      title: item.Title,
      year: Number(item.Year) || null,
      genre: "Unknown",
      externalId: item.imdbID,
      description: "Synced from OMDb"
    })),
    skipDuplicates: true // avoids duplicate insert crash if constraint matches
  });

  return {
    count: list.length,
    inserted: result.count
  };
}

module.exports = {
  syncMoviesFromOmdb
};
