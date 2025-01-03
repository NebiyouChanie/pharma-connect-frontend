import { Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";

const ImageUpload = ({ onUpload, initialImage }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialImage || null); // Preloaded image or uploaded preview
  const [isUploading, setIsUploading] = useState(false); // Track uploading state
  const [isUploaded, setIsUploaded] = useState(false); // Track whether the image is uploaded

  useEffect(() => {
    // Update preview when `initialImage` changes
    if (initialImage) {
      setPreview(initialImage);
      setIsUploaded(true); // If an initial image is provided, mark as uploaded
    }
  }, [initialImage]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Temporary preview
      setIsUploaded(false); // Reset uploaded flag when a new file is selected
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading || isUploaded) return; // Prevent re-upload

    setIsUploading(true); // Start uploading

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pharma connect"); // Your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwmae0ztq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      console.log("Uploaded Image URL:", result.secure_url);
      onUpload(result.secure_url); // Pass the uploaded image URL to the parent
      setPreview(result.secure_url); // Update the preview with the uploaded image URL
      setIsUploaded(true); // Mark as uploaded
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false); // Reset the uploading state
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    setIsUploaded(false); // Reset uploaded state when image is removed
    onUpload("");
  };

  return (
    <div>
      <div className="relative w-48 h-48 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <Trash2Icon />
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
            <span className="text-gray-400 text-4xl">+</span>
            <span className="text-gray-500 text-sm">Upload Image</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {file && !isUploaded && (
        <button
          onClick={handleUpload}
          disabled={isUploading || isUploaded} // Disable the button if already uploaded
          className={`mt-4 ${isUploading ? 'bg-blue-400' : 'bg-blue-500'} text-white px-4 py-2 rounded-md`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
