import { PromptTemplate } from '@langchain/core/prompts';

/**
 * README 分析提示词模板
 */
export const README_ANALYSIS_PROMPT = PromptTemplate.fromTemplate(`
请分析以下 URL 列表，并为每个 URL 提取项目信息。

URL 列表:
{urls}

请为每个 URL 以 JSON 格式返回以下信息：
1. name: 项目名称（从 URL 中提取，需要适合人类阅读，使用常规大小写格式，不要包含特殊字符）
2. category: 项目分类（如: blockchain, web, ai, tool 等）
3. tags: 相关标签数组（如: ["javascript", "api", "client"])

返回一个 JSON 数组，每个元素包含 url 和对应的分析信息，格式如下:
[
  {{
    "url": "原始URL",
    "name": "适合人类阅读的项目名称",
    "category": "分类",
    "tags": ["标签1", "标签2"]
  }},
  // ... 更多项目
]
`.trim());