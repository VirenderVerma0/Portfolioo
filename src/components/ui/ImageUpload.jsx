"use client";
import React, { useState, useRef } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

const ImageUpload = ({ value, onChange, label = "Image", className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, AVIF, HEIC, HEIF)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.data.url;
        setPreview(imageUrl);
        onChange(imageUrl);
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload area */}
      {!preview ? (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <p className="text-sm text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <FiUpload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-400">
                Click to upload image
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, AVIF, HEIC, HEIF (max 5MB)
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="border border-gray-500 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-contain"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <FiImage className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Image uploaded</span>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleClick}
                disabled={uploading}
                className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors disabled:opacity-50"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                <FiX className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL input fallback */}
      <div className="space-y-1">
        <label className="block text-xs text-gray-400">
          Or enter image URL directly:
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
