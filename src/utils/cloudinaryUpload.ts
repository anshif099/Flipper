export const uploadToCloudinary = async (
  file: File,
  userId: string,
  flipbookId: string
): Promise<string> => {

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "flipper_uploads");
  formData.append("folder", `flipper/${userId}/${flipbookId}`);
  formData.append("resource_type", "auto"); // 🔥 important

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dfd2y6oeb/auto/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
};
