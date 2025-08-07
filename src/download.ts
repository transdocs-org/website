import fs from 'fs';
import { httpGet } from './http-client';
import parseGithubUrl from 'git-url-parse';

/**
 * 将GitHub URL转换为raw.githubusercontent.com的URL
 * @param url GitHub URL
 * @returns 转换后的raw URL
 */
function convertToRawUrl(url: string): string {
  const parsed = parseGithubUrl(url);

  if (!parsed) {
    throw new Error('Invalid GitHub URL');
  }

  const { owner, name, ref, filepath } = parsed

  return `https://raw.githubusercontent.com/${owner}/${name}/refs/heads/${ref}/${filepath}`;
}

function convertToRawReadmeUrl(url: string) {
  return `${convertToRawUrl(url)}/README.md`
}

/**
 * 将特定类型的GitHub链接转换为raw链接
 * @param url 需要转换的URL
 * @returns 转换后的raw URL或原始URL
 */
function convertToRawUrlIfNeeded(url: string): string {
  // 如果是 GitHub 链接且是图片等静态资源，则转换为 raw 链接
  if (url.includes('github.com') && (url.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|bmp|tiff|avif)$/i))) {
    try {
      return convertToRawUrl(url);
    } catch (error) {
      console.warn(`无法转换为 raw 链接: ${url}`, error);
    }
  }
  return url;
}

/**
 * 将README中的相对路径链接转换为绝对路径链接
 * @param content README文件内容
 * @param url 原始GitHub URL
 * @returns 处理后的README内容
 */
function convertRelativeLinksToAbsolute(content: string, url: string): string {
  const baseUrl = `${url}${url.endsWith('/') ? '' : '/'}`;

  // 匹配Markdown中的链接和图片
  const markdownLinkRegex = /(!?\[([^\]]*)\]\(([^)]+)\))/g;

  return content.replace(markdownLinkRegex, (match, fullLink, linkText, linkUrl) => {
    // 如果链接是文件内跳转（如 #section），则不处理
    if (linkUrl.startsWith('#')) {
      return match;
    }

    // 如果链接已经是绝对路径，则检查是否需要转换为 raw 链接
    if (linkUrl.startsWith('http') || linkUrl.startsWith('//')) {
      const convertedUrl = convertToRawUrlIfNeeded(linkUrl);
      if (convertedUrl !== linkUrl) {
        return fullLink.replace(linkUrl, convertedUrl);
      }
      return match;
    }

    // 处理相对路径
    try {
      const absoluteUrl = new URL(linkUrl, baseUrl).href;
      const convertedUrl = convertToRawUrlIfNeeded(absoluteUrl);
      return fullLink.replace(linkUrl, convertedUrl);
    } catch (error) {
      // 如果URL解析失败，返回原始链接
      console.warn(`无法解析相对链接: ${linkUrl}`, error);
      return match;
    }
  });
}

/**
 * 带重试机制下载README文件到指定路径
 * @param url README文件的URL
 * @param filePath 保存文件的本地路径
 * @param maxRetries 最大重试次数
 * @returns Promise<void>
 */
export async function downloadReadme(url: string, filePath: string, maxRetries: number = 3): Promise<void> {
  let lastError: any;

  const downloadUrl = url.includes('github.com') ? convertToRawReadmeUrl(url) : url;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // 发送HTTP GET请求获取文件内容
      let data = await httpGet(downloadUrl, { timeout: 10000 });

      // 如果是GitHub URL，处理相对链接
      if (url.includes('github.com')) {
        data = convertRelativeLinksToAbsolute(data, url);
      }

      // 写入文件
      fs.writeFileSync(filePath, data, 'utf-8');
      return;
    } catch (error: any) {
      lastError = error;
      console.log(`下载失败 (${i + 1}/${maxRetries}): ${downloadUrl}`, error.message);

      // 检查是否是客户端错误（4xx），如果是则不重试
      if (error.message && error.message.includes('4')) {
        // 4xx 错误通常是客户端错误，不需要重试
        throw new Error(`下载 ${downloadUrl} 失败: ${error.message}`);
      }

      // 在重试前等待一段时间，使用指数退避策略
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`下载 ${downloadUrl} 失败，已重试 ${maxRetries} 次: ${lastError.message}`);
}