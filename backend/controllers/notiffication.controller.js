import Notiffication from "../models/notiffication.model.js";

export const getnotiffication = async (req, res) => {
  try {
    const userid = req.user._id;
    const notiffication = await Notiffication.find({ to: userid }).populate({
      path: "from",
      select: "username profileimg",
    });

    await Notiffication.updateMany({ to: userid }, { read: true });
    return res.status(200).json(notiffication);
  } catch (error) {
    console.log("error in getnotiffication controllers ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const deletenotiffications = async (req, res) => {
  try {
    const userid = req.user._id;
    await Notiffication.deleteMany({ to: userid });
    res.status(200).json({ message: "notiffication deleted successfully" });
  } catch (error) {
    console.log("error in delte notiffications :", error.message);
    return res.status(500).json("server error");
  }
};
