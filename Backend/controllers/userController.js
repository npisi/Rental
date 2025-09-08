const User = require("../model/userSchema");

const getUser = (req, res) => {
  res.status(200).send(req.user);
};

const deleteUser = async (req, res) => {
  const { _id } = req.user;
  try {
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User Deleted Successfully");
  } catch (err) {
    res.status(500).send("Something Went Wrong: " + err.message);
  }
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const {...data} = req.body
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, data);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User Updated Successfully");
  } catch (err) {
    res.status(500).send("Something Went Wrong: " + err.message);
  }
};

module.exports = { getUser, deleteUser, updateUser };
