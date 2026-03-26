import cloudinary from "../config/cloudinary.js";

export const getUploadSignature = async (req, res) => {
  try {
    const { folder = "courses" } = req.body;

    const timestamp = Math.floor(Date.now() / 1000);

    // Sign ONLY the params you will actually send in the browser upload request
    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET
    );

    return res.json({
      success: true,
      cloudName: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_KEY,
      timestamp,
      folder,
      signature,
    });
  } catch (err) {
    console.error("SIGNATURE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate signature",
    });
  }
};