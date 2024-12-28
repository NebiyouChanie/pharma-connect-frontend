import { Trash2Icon } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const ImageUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

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
      onUpload(result.secure_url); // Pass the uploaded image URL to parent
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  return (
    <div>
      <div className="relative w-48 h-48 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
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

      {file && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
