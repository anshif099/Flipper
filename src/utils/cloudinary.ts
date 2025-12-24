export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "flipper_uploads");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/ddjp8jpcs/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url; // ✅ store this
};
