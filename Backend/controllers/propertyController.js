const Properties = require("../model/propertySchema");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const {removeExpiredDates} = require('../utils/dateUtils')

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "properties", ...options }, // folder keeps assets organized
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

const getProperty = async (req, res) => {
  try {
    const properties = await Properties.find();

    for (let property of properties) {
      await removeExpiredDates(property);
    }

    res.json(properties);
  } catch (err) {
    res.send("Error : " + err.message);
  }
};

const getSingleProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const properties = await Properties.findById(id);
    res.status(200).json(properties);
  } catch (err) {
    res.send("Error : " + err.message);
  }
};

const listProperty = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).send("Only hosts can add properties");
    }

    let profileImageUrl = null;
    let galleryUrls = [];

    if (req.files?.profileImage?.[0]) {
      const result = await uploadBufferToCloudinary(
        req.files.profileImage[0].buffer,
        {
          transformation: [
            { quality: "auto:good", fetch_format: "auto" }, //optimization
          ],
          folder: "properties/profile",
        }
      );
      profileImageUrl = result.secure_url;
    }

    if (req.files?.images?.length) {
      const uploads = req.files.images.map((file) =>
        uploadBufferToCloudinary(file.buffer, {
          transformation: [{ quality: "auto:good", fetch_format: "auto" }],
        }).then((r) => r.secure_url)
      );
      galleryUrls = await Promise.all(uploads);
    }

    const prop = new Properties({
      ...req.body,
      hostId: req.user.id,
      profileImage: profileImageUrl,
      images: galleryUrls,
    });
    await prop.save();
    res.send("Property added Successfully");
  } catch (err) {
    res.send("Error : " + err.message);
  }
};

const updateProperty = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).send("Only hosts can update properties");
    }

    const prop = await Properties.findById(req.params.id);
    if (!prop) return res.status(404).send("Property not Found");

    if (prop.hostId.toString() !== req.user.id) {
      return res.status(403).send("Not authorized to update this property");
    }

    // Optional: allow replacing profile image and appending more gallery images
    if (req.files?.profileImage?.[0]) {
      const result = await uploadBufferToCloudinary(
        req.files.profileImage[0].buffer,
        {
          transformation: [{ quality: "auto:good", fetch_format: "auto" }],
          folder: "properties/profile",
        }
      );
      prop.profileImage = result.secure_url;
    }

    if (req.files?.images?.length) {
      const uploads = req.files.images.map((file) =>
        uploadBufferToCloudinary(file.buffer, {
          transformation: [{ quality: "auto:good", fetch_format: "auto" }],
        }).then((r) => r.secure_url)
      );
      const newUrls = await Promise.all(uploads);
      prop.images = [...prop.images, ...newUrls];
    }

    // Merge non-file fields
    Object.assign(prop, req.body);
    await prop.save();
    res.send("Property Updated Successfully");
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
};

const deleteProperty = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).send("Only hosts can update properties");
    }

    const prop = await Properties.findById(req.params.id);
    if (!prop) return res.status(404).send("Property not Found");

    if (prop.hostId.toString() !== req.user.id) {
      return res.status(403).send("Not authorized to update this property");
    }

    await prop.deleteOne();
    res.send("Deleted Successfully");
  } catch (err) {
    res.send("Error : " + err.message);
  }
};

const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 1) {
      return res.json([]);
    }

    const searchRegex = new RegExp(q, "i");
    const suggestions = [];

    // Search for properties by title
    const propertySuggestions = await Properties.find(
      { title: searchRegex },
      { title: 1, _id: 0 }
    ).limit(5);

    propertySuggestions.forEach((prop) => {
      suggestions.push({
        type: "property",
        value: prop.title,
        category: "property",
      });
    });

    // Search for properties by location (city, state, country)
    const locationSuggestions = await Properties.find(
      {
        $or: [
          { "location.city": searchRegex },
          { "location.state": searchRegex },
          { "location.country": searchRegex },
          { "location.address": searchRegex },
        ],
      },
      { location: 1, _id: 0 }
    ).limit(5);

    locationSuggestions.forEach((prop) => {
      const location = prop.location;
      if (location.city && location.city.match(searchRegex)) {
        suggestions.push({
          type: "location",
          value: location.city,
          category: "city",
        });
      }
      if (location.state && location.state.match(searchRegex)) {
        suggestions.push({
          type: "location",
          value: location.state,
          category: "state",
        });
      }
      if (location.country && location.country.match(searchRegex)) {
        suggestions.push({
          type: "location",
          value: location.country,
          category: "country",
        });
      }
    });

    // Search for amenities
    const amenitySuggestions = await Properties.find(
      { amenities: searchRegex },
      { amenities: 1, _id: 0 }
    ).limit(5);

    amenitySuggestions.forEach((prop) => {
      prop.amenities.forEach((amenity) => {
        if (amenity.match(searchRegex)) {
          suggestions.push({
            type: "amenity",
            value: amenity,
            category: "amenity",
          });
        }
      });
    });

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter(
        (suggestion, index, self) =>
          index ===
          self.findIndex(
            (s) => s.value === suggestion.value && s.type === suggestion.type
          )
      )
      .slice(0, 10);

    res.json(uniqueSuggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ error: "Error fetching suggestions" });
  }
};

const searchProperties = async (req, res) => {
  try {
    const { query, location, type } = req.query;

    // Build search criteria
    const searchCriteria = {};

    // Search by query (title, description)
    if (query) {
      const queryRegex = new RegExp(query, "i");
      searchCriteria.$or = [{ title: queryRegex }, { description: queryRegex }];
    }

    // Search by location
    if (location) {
      const locationRegex = new RegExp(location, "i");
      const locationCriteria = {
        $or: [
          { "location.city": locationRegex },
          { "location.state": locationRegex },
          { "location.country": locationRegex },
          { "location.address": locationRegex },
        ],
      };

      if (searchCriteria.$or) {
        searchCriteria.$and = [{ $or: searchCriteria.$or }, locationCriteria];
        delete searchCriteria.$or;
      } else {
        Object.assign(searchCriteria, locationCriteria);
      }
    }

    // Search by amenity type
    if (type) {
      const typeRegex = new RegExp(type, "i");
      const typeCriteria = { amenities: typeRegex };

      if (searchCriteria.$and) {
        searchCriteria.$and.push(typeCriteria);
      } else if (searchCriteria.$or) {
        searchCriteria.$and = [{ $or: searchCriteria.$or }, typeCriteria];
        delete searchCriteria.$or;
      } else {
        Object.assign(searchCriteria, typeCriteria);
      }
    }

    // If no search criteria, return all properties
    const finalCriteria =
      Object.keys(searchCriteria).length > 0 ? searchCriteria : {};

    const properties = await Properties.find(finalCriteria);
    res.json(properties);
  } catch (err) {
    console.error("Error searching properties:", err);
    res.status(500).json({ error: "Error searching properties" });
  }
};

module.exports = {
  getProperty,
  getSingleProperty,
  listProperty,
  updateProperty,
  deleteProperty,
  getSuggestions,
  searchProperties,
};
