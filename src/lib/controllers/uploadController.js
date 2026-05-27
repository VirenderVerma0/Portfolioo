import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadController = {
  async uploadImage(req) {
    try {
      // Check if request method is POST
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get the form data
      const formData = await req.formData();
      const file = formData.get('image');

      if (!file) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No image file provided'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
        'image/avif',
        'image/heic',
        'image/heif'
      ];
      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid file type. Supported formats: JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, AVIF, HEIC, HEIF.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        return new Response(JSON.stringify({
          success: false,
          error: 'File size too large. Maximum size is 5MB.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio-uploads', // Optional: organize uploads in a folder
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' }, // Optional: resize images
              { quality: 'auto' } // Optional: auto quality
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      // Return success response with image URL
      return new Response(JSON.stringify({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Upload error:', error);

      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to upload image. Please try again.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async uploadResume(req) {
    try {
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await connectDB();

      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1];
      if (!token) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }

      const jwtSecret = process.env.JWT_SECRET || process.env.JWT_Secret;
      if (!jwtSecret) {
        return new Response(JSON.stringify({ success: false, error: 'JWT secret not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id);
      if (!user) {
        return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      const formData = await req.formData();
      const file = formData.get('resume');

      if (!file) {
        return new Response(JSON.stringify({ success: false, error: 'No resume file provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid resume type. Only PDF, DOC, and DOCX are allowed.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return new Response(JSON.stringify({
          success: false,
          error: 'File size too large. Maximum size is 10MB.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio-resumes',
            resource_type: 'raw',
            public_id: `resume_${user._id}_${Date.now()}`
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      user.resumeUrl = result.secure_url;
      await user.save();

      return new Response(JSON.stringify({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
          format: result.format
        },
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
          profilePhoto: user.profilePhoto,
          resumeUrl: user.resumeUrl
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to upload resume. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }
};
