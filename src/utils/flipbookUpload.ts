// import { auth, db } from "@/firebase";
// import { ref, push, set } from "firebase/database";
// import { uploadToCloudinary } from "./cloudinaryUpload";

// export const uploadCompleteFlipbook = async (
//   files: File[],
//   title: string,
//   onProgress?: (current: number, total: number, status: string) => void
// ): Promise<string> => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("User not authenticated");

//   if (files.length > 10) {
//     throw new Error("Maximum 10 files allowed");
//   }

//   // 🔹 Create flipbook entry first
//   const blogRef = push(ref(db, "blogs"));
//   const flipbookId = blogRef.key!;
//   const total = files.length;

//   const uploadedUrls: string[] = [];

//   for (let i = 0; i < files.length; i++) {
//     onProgress?.(i, total, `Uploading ${files[i].name}...`);

//     const url = await uploadToCloudinary(
//       files[i],
//       user.uid,
//       flipbookId
//     );

//     uploadedUrls.push(url);

//     onProgress?.(i + 1, total, `Uploaded ${i + 1}/${total}`);
//   }

//   // 🔹 Save metadata to Firebase DB
//   await set(blogRef, {
//     userId: user.uid,
//     title,
//     pageUrls: uploadedUrls,
//     createdAt: Date.now(),
//   });

//   return flipbookId;
// };
import { auth, db } from "@/firebase";
import { ref, push, set } from "firebase/database";
import { uploadToCloudinary } from "./cloudinaryUpload";

export const uploadCompleteFlipbook = async (
  files: File[],
  title: string,
  onProgress?: (current: number, total: number, status: string) => void
): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  if (files.length > 10) {
    throw new Error("Maximum 10 files allowed");
  }

  // 🔹 Create flipbook entry first
  const blogRef = push(ref(db, "blogs"));
  const flipbookId = blogRef.key!;
  const total = files.length;

  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    onProgress?.(i, total, `Uploading ${files[i].name}...`);

    const url = await uploadToCloudinary(
      files[i],
      user.uid,
      flipbookId
    );

    uploadedUrls.push(url);

    onProgress?.(i + 1, total, `Uploaded ${i + 1}/${total}`);
  }

  // 🔹 Save metadata to Firebase DB with published status
  await set(blogRef, {
    userId: user.uid,
    title,
    author: user.displayName || user.email?.split("@")[0] || "Anonymous",
    pageUrls: uploadedUrls,
    createdAt: Date.now(),
    published: false, // ✅ Default to unpublished
    likes: 0,
    views: 0,
  });

  return flipbookId;
};