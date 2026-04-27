/**
 * 图片优化脚本
 *
 * 将 public/axis 目录中的图片转换为 WebP 格式
 * 生成响应式图片（480w, 800w, 1200w）
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = 'public/axis';
const OUTPUT_DIR = 'public/axis-optimized';

// WebP 质量（0-100）
const QUALITY = 85;

// 响应式图片尺寸
const SIZES = [
  { width: 480, suffix: '-480' },
  { width: 800, suffix: '-800' },
  { width: 1200, suffix: '-1200' },
];

// 支持的图片格式
const SUPPORTED_FORMATS = /\.(png|jpe?g|webp)$/i;

async function convertImage(inputPath: string, outputDir: string, filename: string) {
  const baseName = path.basename(filename, path.extname(filename));

  console.log(`  转换: ${filename}`);

  try {
    // 生成原图尺寸的 WebP
    const outputPath = path.join(outputDir, `${baseName}.webp`);
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    // 生成响应式尺寸
    for (const size of SIZES) {
      const sizedOutputPath = path.join(outputDir, `${baseName}${size.suffix}.webp`);
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .resize(size.width, undefined, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(sizedOutputPath);
    }

    return true;
  } catch (error) {
    console.error(`  ✗ 转换失败: ${filename}`, error);
    return false;
  }
}

async function main() {
  console.log('=== 故宫斗拱项目 - 图片优化 ===\n');

  // 检查输入目录
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`输入目录不存在: ${INPUT_DIR}`);
    process.exit(1);
  }

  // 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`创建输出目录: ${OUTPUT_DIR}\n`);
  }

  // 获取所有图片文件
  const files = fs.readdirSync(INPUT_DIR).filter(f => SUPPORTED_FORMATS.test(f));

  if (files.length === 0) {
    console.log('没有找到需要转换的图片');
    return;
  }

  console.log(`找到 ${files.length} 张图片\n`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const result = await convertImage(inputPath, OUTPUT_DIR, file);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log('\n=== 转换完成 ===');
  console.log(`成功: ${success}`);
  console.log(`失败: ${failed}`);

  // 显示体积对比
  const originalSize = getDirectorySize(INPUT_DIR);
  const optimizedSize = getDirectorySize(OUTPUT_DIR);
  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

  console.log(`\n原始体积: ${formatBytes(originalSize)}`);
  console.log(`优化体积: ${formatBytes(optimizedSize)}`);
  console.log(`减少: ${reduction}%`);
}

function getDirectorySize(dir: string): number {
  return fs.readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f)).isFile())
    .reduce((sum, f) => sum + fs.statSync(path.join(dir, f)).size, 0);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

main().catch(console.error);
