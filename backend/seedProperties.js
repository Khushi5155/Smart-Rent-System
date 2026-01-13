const mongoose = require("mongoose");
const Property = require("./models/Property");

const dummyProperties =
  require("../frontend/src/data/dummyProperties.js").default;


mongoose
  .connect("mongodb://127.0.0.1:27017/smartrent")
  .then(async () => {
    console.log("MongoDB connected");

    await Property.deleteMany(); // clear old data
    console.log("Old properties removed");

    const formatted = dummyProperties.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      location: {
        city: p.location?.city || "Unknown",
        country: p.location?.country || "Unknown",
      },
      images: p.images || [p.image],
      propertyType: p.category || p.propertyType || "House",
      capacity: {
        bedrooms: p.beds || 2,
        bathrooms: p.baths || 2,
        guests: p.guests || 4,
      },
      amenities: p.amenities || [],
      isApproved: true,
      isActive: true,
    }));

    await Property.insertMany(formatted);
    console.log(`Inserted ${formatted.length} properties`);

    process.exit();
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
