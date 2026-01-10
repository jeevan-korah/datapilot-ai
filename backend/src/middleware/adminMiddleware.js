// middleware/adminMiddleware.js

/**
 * Middleware to check if the authenticated user is an admin
 * Must be used after authenticate middleware
 * Based on userType enum from schema
 */
export const adminOnly = (req, res, next) => {
  try {
    // Check if user exists (should be set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    // userType is enum in database: ADMIN, EMPLOYEE, VIEWER
    const userType = req.user.userType || req.user.role;
    
    if (userType?.toUpperCase() !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: error.message
    });
  }
};