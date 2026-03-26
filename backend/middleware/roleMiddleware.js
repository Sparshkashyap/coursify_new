const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

   console.log("ROLE CHECK:", req.user);

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "Role not found on user",
      });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${userRole}`,
      });
    }

    next();
  };
};

export default allowRoles;