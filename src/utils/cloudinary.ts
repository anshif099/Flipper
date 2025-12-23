export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "flipbook_unsigned");
  formData.append("cloud_name", "dfd2y6oeb");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dfd2y6oeb/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url as string;
};
