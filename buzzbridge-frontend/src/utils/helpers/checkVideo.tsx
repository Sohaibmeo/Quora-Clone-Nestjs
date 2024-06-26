export function isVideo(url: string): boolean {
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".wmv",
    ".flv",
    ".mkv",
    ".webm",
    ".mpg",
    ".mpeg",
    ".m4v",
  ];
  if(!url) return false
  const fileExtension = url.toLowerCase().substring(url.lastIndexOf("."));
  return videoExtensions.includes(fileExtension);
}
