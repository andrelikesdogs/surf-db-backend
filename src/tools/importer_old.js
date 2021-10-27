const mongoose = require("./entities/mongo");
const args = process.argv;
const fs = require("fs");

const { parse } = require("csv/lib/es5/sync");

console.log("reading ", args[2]);
const csvString = fs.readFileSync(args[2]);

const records = parse(csvString, { columns: true, skipEmptyLines: true });

//console.log(records);
console.log(`importing ${records.length} into mongodb`);

const Map = require("./entities/surfdb/Map");

console.log("starting import");
Map.insertMany(
  records.map((record) => {
    return {
      mapName: record["Map Name"],
      category: record["Category"].length == 0 ? null : record["Category"],
      tags: record["Tags"].length == 0 ? [] : record["Tags"].split(", "),
      tier: isFinite(parseInt(record["Tier"], 10))
        ? parseInt(record["Tier"], 10)
        : null,
      stages: isFinite(parseInt(record["Stages"], 10))
        ? parseInt(record["Stages"], 10)
        : null,
      bonusStages: isFinite(parseInt(record["Bonus Stages"], 10))
        ? parseInt(record["Bonus Stages"], 10)
        : null,
      aestheticRatings: isFinite(parseInt(record["Aesthetic Rating"], 10))
        ? [parseInt(record["Aesthetic Rating"], 10)]
        : null,
    };
  })
)
  .then(() => {
    console.log("importing done");
  })
  .catch((err) => {
    console.error("importing failed", err);
  });
