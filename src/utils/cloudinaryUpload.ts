export const uploadToCloudinary = async (
  file: File,
  userId: string,
  flipbookId: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "flipper_uploads");

  // ✅ PATH / FOLDER STRUCTURE
  formData.append("folder", `flipper/${userId}/${flipbookId}`);

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/ddjp8jpcs/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url; // 👈 store this
};
