import Certificate from "../models/Certificate.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const getCertificateById = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const { id } = req.params;

    const certificate = await Certificate.findById(id)
      .populate("course", "title")
      .populate("enrollment");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (String(certificate.student) !== String(studentId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this certificate",
      });
    }

    return res.json({
      success: true,
      certificate,
    });
  } catch (err) {
    console.error("GET CERTIFICATE BY ID ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};