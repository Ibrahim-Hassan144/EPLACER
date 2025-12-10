// seed.js - Import CS sites + internship sites into MongoDB
require("dotenv").config();
const mongoose = require("mongoose");
const Placement = require("./models/Placement");
const Internship = require("./models/Internship");

// Import raw seed data
const csData = require("./seed-data/csData.js");
const internshipData = require("./seed-data/internships.js");

async function start() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");

    console.log("Clearing old data...");
    await Placement.deleteMany({});
    await Internship.deleteMany({});

    // -------------------------
    //  SEED CS Placements
    // -------------------------
    console.log("Importing CS placements...");

    const csFormatted = csData.map((x) => ({
      title: x.title,
      category: x.category,
      location: x.location,
      slots: x.slots,
      image: x.image,

      // add default fallback values so the side panel works
      phone: x.phone || "0700 000 000",
      email: x.email || "info@" + x.title.toLowerCase().replace(/\s+/g, "") + ".org",

      // optional coordinates for future map upgrade
      coordinates: x.coordinates || null,
    }));

    await Placement.insertMany(csFormatted);

    // -------------------------
    //  SEED Internships
    // -------------------------
    console.log("Importing Internships...");

    const internFormatted = internshipData.map((x) => ({
      company: x.title,
      department: x.department,
      location: x.location,
      slots: x.slots,
      logo: x.image,

      // ensure these exist
      email: x.email || "careers@" + x.title.toLowerCase().replace(/\s+/g, "") + ".com",
      phone: x.phone || "0700 000 000",
    }));

    await Internship.insertMany(internFormatted);

    console.log("🌱 Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ SEEDING ERROR:", err);
    process.exit(1);
  }
}

start();
