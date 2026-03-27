import User from "../models/User.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const makeInstructor = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "instructor" },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "User promoted to instructor",
      user,
    });
  } catch (error) {
    console.error("MAKE INSTRUCTOR ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET MY PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { name } = req.body;

    console.log("UPDATE PROFILE CONTENT-TYPE:", req.headers["content-type"]);
    console.log("UPDATE PROFILE BODY:", req.body);
    console.log("UPDATE PROFILE FILE:", req.file);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    const uploadedAvatarUrl =
      req.file?.path ||
      req.file?.secure_url ||
      req.file?.url ||
      "";

    if (uploadedAvatarUrl) {
      user.avatar = uploadedAvatarUrl;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const removeMyProfileAvatar = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.avatar = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
      user: {
        _id: user._id,
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: "",
      },
    });
  } catch (error) {
    console.error("REMOVE PROFILE AVATAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};