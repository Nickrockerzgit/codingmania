// // const { getVideoDurationInSeconds } = require('get-video-duration');
// const prisma = require('../../prisma/client');

// // ESM package ko CommonJS mein use karne ka fix
// const getVideoDurationInSeconds = async (filePath) => {
//   const { getVideoDurationInSeconds } = await import('get-video-duration');
//   return await getVideoDurationInSeconds(filePath);
// };

// // Upload vlog controller
// const uploadVlog = async (req, res) => {
//   try {
//     const { title } = req.body;
//     const files = req.files;

//     if (!files?.video?.[0] || !files?.thumbnail?.[0]) {
//       return res.status(400).json({ message: "Both video and thumbnail are required" });
//     }

//     const videoPath = `/uploads/videos/${files.video[0].filename}`;
//     const thumbnailPath = `/uploads/thumbnails/${files.thumbnail[0].filename}`;

//     // Video duration nikalna
//     const durationInSeconds = await getVideoDurationInSeconds(files.video[0].path);
//     const formattedDuration = new Date(durationInSeconds * 1000).toISOString().substring(14, 19); // mm:ss

//     // New vlog create karna
//     const newVlog = await prisma.vlogs.create({
//       data: {
//         title: title?.trim() || "Untitled Vlog",
//         video_url: videoPath,
//         thumbnail_url: thumbnailPath,
//         duration: formattedDuration,
//         views: 0,
//         likes: 0,
//         // created_at automatically handle ho jayega by default(now())
//       },
//     });

//     res.status(201).json({
//       message: "Vlog uploaded successfully",
//       vlog: {
//         ...newVlog,
//         id: Number(newVlog.id), // BigInt ko Number mein convert
//       },
//     });
//   } catch (error) {
//     console.error("Upload Vlog Error:", error);
//     res.status(500).json({
//       message: "Failed to upload vlog",
//       error: error.message,
//     });
//   }
// };

// // Get all vlogs controller
// const getVlogs = async (req, res) => {
//   try {
//     const vlogs = await prisma.vlogs.findMany({
//       orderBy: { created_at: 'desc' },
//     });

//     // BigInt issue fix: id ko Number mein convert kar rahe hain
//     const formattedVlogs = vlogs.map((vlog) => ({
//       ...vlog,
//       id: Number(vlog.id),
//       views: Number(vlog.views),
//       likes: Number(vlog.likes),
//     }));

//     res.status(200).json(formattedVlogs);
//   } catch (error) {
//     console.error("Fetch Vlogs Error:", error);
//     res.status(500).json({ message: "Error fetching vlogs", error: error.message });
//   }
// };

// // Increment views
// const incrementViews = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || isNaN(id)) {
//       return res.status(400).json({ message: "Valid vlog ID is required" });
//     }

//     const updatedVlog = await prisma.vlogs.update({
//       where: { id: parseInt(id) },
//       data: { views: { increment: 1 } },
//     });

//     res.status(200).json({
//       message: "Views updated successfully",
//       views: Number(updatedVlog.views),
//     });
//   } catch (error) {
//     console.error("Increment Views Error:", error);
//     res.status(500).json({ message: "Error updating views", error: error.message });
//   }
// };

// // Like vlog
// const likeVlog = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || isNaN(id)) {
//       return res.status(400).json({ message: "Valid vlog ID is required" });
//     }

//     const updatedVlog = await prisma.vlogs.update({
//       where: { id: parseInt(id) },
//       data: { likes: { increment: 1 } },
//     });

//     res.status(200).json({
//       message: "Like added successfully",
//       likes: Number(updatedVlog.likes),
//     });
//   } catch (error) {
//     console.error("Like Vlog Error:", error);
//     res.status(500).json({ message: "Error updating likes", error: error.message });
//   }
// };

// module.exports = {
//   uploadVlog,
//   getVlogs,
//   incrementViews,
//   likeVlog,
// };









const prisma = require('../../prisma/client');
const { notifyByRole } = require('../utils/notify');
const imagekit = require('../config/imagekit');
const { getFolderPath } = require('../config/multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');

// Important: ffprobe-static ka binary path set kar do
ffmpeg.setFfprobePath(ffprobeStatic.path);

// Helper: Buffer se video duration nikaalne ka function
const getVideoDuration = async (videoBuffer) => {
  const tempPath = path.join(os.tmpdir(), `temp-video-${Date.now()}.mp4`);

  try {
    // Temp file banao
    fs.writeFileSync(tempPath, videoBuffer);

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(tempPath, (err, metadata) => {
        if (err) {
          console.error('ffprobe error:', err.message);
          return reject(err);
        }

        const duration = metadata.format?.duration || 0;
        resolve(duration);
      });
    });
  } catch (err) {
    console.error('Temp file error:', err);
    throw err;
  } finally {
    // Cleanup - temp file delete
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
};

// ImageKit pe upload helper
const uploadToImageKit = async (buffer, originalname, fieldname) => {
  const folder = getFolderPath(fieldname);
  const response = await imagekit.upload({
    file: buffer,
    fileName: originalname,
    folder: folder,
  });
  return { url: response.url, fileId: response.fileId };
};

// ------------------- UPLOAD NEW VLOG -------------------
const uploadVlog = async (req, res) => {
  try {
    const { title, content = '', excerpt = '', slug = '', published = 'false' } = req.body;
    const files = req.files;

    if (!files?.video?.[0] || !files?.thumbnail?.[0]) {
      return res.status(400).json({ message: "Both video and thumbnail are required" });
    }

    const videoFile = files.video[0];
    const thumbnailFile = files.thumbnail[0];

    // 1. ImageKit pe upload
    const videoUpload = await uploadToImageKit(videoFile.buffer, videoFile.originalname, 'video');
    const thumbnailUpload = await uploadToImageKit(thumbnailFile.buffer, thumbnailFile.originalname, 'thumbnail');

    // 2. Video duration nikaalo
    let durationInSeconds = 0;
    try {
      durationInSeconds = await getVideoDuration(videoFile.buffer);
    } catch (err) {
      console.warn('Duration calculation failed, using 0:', err.message);
    }

    const formattedDuration = new Date(durationInSeconds * 1000).toISOString().substring(14, 19) || '00:00';

    // 3. Database mein save
    const newVlog = await prisma.vlogs.create({
      data: {
        title: title?.trim() || "Untitled Vlog",
        content: content.trim(),
        excerpt: excerpt.trim(),
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        published: published === 'true',
        video_url: videoUpload.url,
        thumbnail_url: thumbnailUpload.url,
        videoFileId: videoUpload.fileId,
        thumbnailFileId: thumbnailUpload.fileId,
        duration: formattedDuration,
        views: 0,
        likes: 0,
      },
    });

    // Notify students + alumni about the new vlog (only when published).
    if (newVlog.published) {
      const io = req.app.get('io');
      const payload = {
        type: 'vlog',
        title: `New vlog: ${newVlog.title}`,
        message: newVlog.excerpt || 'A new vlog has been posted.',
        link: 'vlogs',
      };
      await notifyByRole(io, 'student', payload);
      await notifyByRole(io, 'alumni', payload);
    }

    res.status(201).json({
      message: "Vlog uploaded successfully",
      vlog: { ...newVlog, id: Number(newVlog.id) },
    });
  } catch (error) {
    console.error("Upload Vlog Error:", error);
    res.status(500).json({ message: "Failed to upload vlog", error: error.message });
  }
};

// ------------------- UPDATE VLOG -------------------
const updateVlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content = '', excerpt = '', slug = '', published = 'false' } = req.body;
    const files = req.files;

    const existing = await prisma.vlogs.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ message: "Vlog not found" });

    let videoUrl = existing.video_url;
    let videoFileId = existing.videoFileId;
    let thumbnailUrl = existing.thumbnail_url;
    let thumbnailFileId = existing.thumbnailFileId;
    let duration = existing.duration;

    // New video upload hua to
    if (files?.video?.[0]) {
      const videoFile = files.video[0];
      const videoUpload = await uploadToImageKit(videoFile.buffer, videoFile.originalname, 'video');
      videoUrl = videoUpload.url;
      videoFileId = videoUpload.fileId;

      // Purana video ImageKit se delete
      if (existing.videoFileId) {
        await imagekit.deleteFile(existing.videoFileId).catch(err => console.warn('Old video delete failed:', err));
      }

      // Naya duration calculate
      let durationInSeconds = 0;
      try {
        durationInSeconds = await getVideoDuration(videoFile.buffer);
      } catch (err) {
        console.warn('Duration recalc failed:', err.message);
      }
      duration = new Date(durationInSeconds * 1000).toISOString().substring(14, 19) || '00:00';
    }

    // New thumbnail upload hua to
    if (files?.thumbnail?.[0]) {
      const thumbnailFile = files.thumbnail[0];
      const thumbnailUpload = await uploadToImageKit(thumbnailFile.buffer, thumbnailFile.originalname, 'thumbnail');
      thumbnailUrl = thumbnailUpload.url;
      thumbnailFileId = thumbnailUpload.fileId;

      if (existing.thumbnailFileId) {
        await imagekit.deleteFile(existing.thumbnailFileId).catch(err => console.warn('Old thumbnail delete failed:', err));
      }
    }

    const updatedVlog = await prisma.vlogs.update({
      where: { id: parseInt(id) },
      data: {
        title: title?.trim() || existing.title,
        content: content.trim() || existing.content,
        excerpt: excerpt.trim() || existing.excerpt,
        slug: slug || existing.slug,
        published: published === 'true',
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        videoFileId,
        thumbnailFileId,
        duration,
      },
    });

    res.status(200).json({
      message: "Vlog updated successfully",
      vlog: { ...updatedVlog, id: Number(updatedVlog.id) },
    });
  } catch (error) {
    console.error("Update Vlog Error:", error);
    res.status(500).json({ message: "Failed to update vlog", error: error.message });
  }
};

// ------------------- DELETE VLOG -------------------
const deleteVlog = async (req, res) => {
  try {
    const { id } = req.params;

    const vlog = await prisma.vlogs.findUnique({ where: { id: parseInt(id) } });
    if (!vlog) return res.status(404).json({ message: "Vlog not found" });

    // ImageKit se files delete
    if (vlog.videoFileId) {
      await imagekit.deleteFile(vlog.videoFileId).catch(err => console.warn('Video delete failed:', err));
    }
    if (vlog.thumbnailFileId) {
      await imagekit.deleteFile(vlog.thumbnailFileId).catch(err => console.warn('Thumbnail delete failed:', err));
    }

    await prisma.vlogs.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Vlog deleted successfully" });
  } catch (error) {
    console.error("Delete Vlog Error:", error);
    res.status(500).json({ message: "Failed to delete vlog", error: error.message });
  }
};

// ------------------- GET ALL VLOGS -------------------
const getVlogs = async (req, res) => {
  try {
    const vlogs = await prisma.vlogs.findMany({
      orderBy: { created_at: 'desc' },
    });

    const formattedVlogs = vlogs.map((vlog) => ({
      ...vlog,
      id: Number(vlog.id),
      views: Number(vlog.views),
      likes: Number(vlog.likes),
    }));

    res.status(200).json(formattedVlogs);
  } catch (error) {
    console.error("Fetch Vlogs Error:", error);
    res.status(500).json({ message: "Error fetching vlogs", error: error.message });
  }
};

// ------------------- INCREMENT VIEWS & LIKES (same as before) -------------------
const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "Valid vlog ID required" });

    const updated = await prisma.vlogs.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
    });

    res.json({ message: "Views incremented", views: Number(updated.views) });
  } catch (error) {
    console.error("Increment Views Error:", error);
    res.status(500).json({ message: "Error updating views" });
  }
};

const likeVlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "Valid vlog ID required" });

    const updated = await prisma.vlogs.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } },
    });

    res.json({ message: "Like added", likes: Number(updated.likes) });
  } catch (error) {
    console.error("Like Vlog Error:", error);
    res.status(500).json({ message: "Error updating likes" });
  }
};

module.exports = {
  uploadVlog,
  updateVlog,
  deleteVlog,
  getVlogs,
  incrementViews,
  likeVlog,
};