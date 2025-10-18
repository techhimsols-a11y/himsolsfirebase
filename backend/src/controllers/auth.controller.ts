import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";
import { logger } from "../utils/logger";

// JWT Token generation helper
const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      type: "refresh",
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" } // Long-lived refresh token
  );

  return { accessToken, refreshToken };
};

// Set JWT cookies helper
const setJWTCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  // Access token cookie (short-lived, httpOnly)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  });

  // Refresh token cookie (long-lived, httpOnly)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/auth/refresh",
  });
};

// Clear JWT cookies helper
const clearJWTCookies = (res: Response) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Validate input
    if (!name || !email || !password) {
      throw new AppError(400, "Name, email, and password are required");
    }

    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters long");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(400, "Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobile,
        role: "USER", // Default role
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set cookies
    setJWTCookies(res, accessToken, refreshToken);

    // Log successful registration
    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set cookies
    setJWTCookies(res, accessToken, refreshToken);

    // Log successful login
    logger.info(`User logged in: ${email} (${user.role})`);

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear cookies
    clearJWTCookies(res);

    // Log logout
    if (req.user) {
      logger.info(`User logged out: ${req.user.email}`);
    }

    res.json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AppError(401, "Refresh token not provided");
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;

    if (decoded.type !== "refresh") {
      throw new AppError(401, "Invalid token type");
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(401, "User not found");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Set new cookies
    setJWTCookies(res, accessToken, newRefreshToken);

    res.json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
        },
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid refresh token"));
    } else {
      next(error);
    }
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mobile: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { name, email, mobile } = req.body;

    // Check if email is already taken
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new AppError(400, "Email already taken");
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        mobile,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mobile: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
      throw new AppError(
        400,
        "New password must be at least 6 characters long"
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(401, "Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Log password change
    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, "Email is required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      res.json({
        status: "success",
        message:
          "If the email exists, password reset instructions will be sent",
      });
      return;
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id, type: "reset" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // TODO: Send email with reset token
    // For now, just log it
    logger.info(`Password reset requested for: ${email}, token: ${resetToken}`);

    res.json({
      status: "success",
      message: "If the email exists, password reset instructions will be sent",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError(400, "Token and new password are required");
    }

    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters long");
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.type !== "reset") {
      throw new AppError(401, "Invalid reset token");
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    // Log password reset
    logger.info(`Password reset for user: ${user.email}`);

    res.json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid or expired reset token"));
    } else {
      next(error);
    }
  }
};

// Admin-specific login (optional, for direct admin access)
export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }
    logger.info(`Admin login attempt: ${email}`);
    // Check if user exists and is admin
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== "ADMIN") {
      throw new AppError(401, "Invalid credentials or insufficient privileges");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    logger.info(`Admin password valid: ${isPasswordValid}`);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid credentials");
    }
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    logger.info(`Admin tokens: ${accessToken}, ${refreshToken}`);
    // Set cookies
    setJWTCookies(res, accessToken, refreshToken);

    // Log admin login
    logger.info(`Admin logged in: ${email}`);

    res.json({
      status: "success",
      message: "Admin login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
