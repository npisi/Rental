const Properties = require("../model/propertySchema");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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
    res.json(properties);
  } catch (err) {
    res.send("Error : " + err.message);
  }
};

const getSingleProperty = async (req,res) => {

  const { id} = req.params

  try{
    const properties = await Properties.findById(id)
    res.status(200).json(properties)
  }catch (err) {
    res.send("Error : " + err.message);
  }
}

const listProperty = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).send("Only hosts can add properties");
    }

    let profileImageUrl = null
    let galleryUrls = [];

    if(req.files?.profileImage?.[0]){
      const result = await uploadBufferToCloudinary(req.files.profileImage[0].buffer,{
        transformation : [
          {quality :"auto:good", fetch_format : "auto"} //optimization
        ],
        folder : "properties/profile"
      })
      profileImageUrl = result.secure_url
    }
    
    if (req.files?.images?.length) {
      const uploads = req.files.images.map((file) =>
        uploadBufferToCloudinary(file.buffer, {
          transformation: [{ quality: "auto:good", fetch_format: "auto" }]
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
      const result = await uploadBufferToCloudinary(req.files.profileImage[0].buffer, {
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
        folder: "properties/profile"
      });
      prop.profileImage = result.secure_url;
    }

    if (req.files?.images?.length) {
      const uploads = req.files.images.map((file) =>
        uploadBufferToCloudinary(file.buffer, {
          transformation: [{ quality: "auto:good", fetch_format: "auto" }]
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
module.exports = { getProperty, getSingleProperty, listProperty, updateProperty, deleteProperty };
