// 将文件名中的空格替换为连字符，确保跨系统兼容性
export function sanitizeFilename(filename: string): string {
  return filename.replace(/\s+/g, '-');
}