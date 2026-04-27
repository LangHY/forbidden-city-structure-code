#!/bin/bash

# 故宫斗拱项目 - 图片优化脚本
# 使用 ImageMagick (convert) 或 sips (macOS) 转换图片为 WebP 格式

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

INPUT_DIR="$PROJECT_ROOT/public/axis"
OUTPUT_DIR="$PROJECT_ROOT/public/axis-optimized"
QUALITY=${QUALITY:-85}

echo "=== 故宫斗拱项目 - 图片优化 ==="
echo "输入目录: $INPUT_DIR"
echo "输出目录: $OUTPUT_DIR"
echo "质量: $QUALITY%"
echo ""

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 检查是否有 cwebp 工具（Google WebP 编码器）
if command -v cwebp &> /dev/null; then
    echo "使用 cwebp 进行转换..."
    CONVERTER="cwebp"
# 检查是否有 ImageMagick
elif command -v convert &> /dev/null; then
    echo "使用 ImageMagick 进行转换..."
    CONVERTER="imagemagick"
else
    echo "⚠️  未找到 cwebp 或 ImageMagick"
    echo "请安装其中一个工具："
    echo "  - cwebp: brew install webp"
    echo "  - ImageMagick: brew install imagemagick"
    echo ""
    echo "将使用 macOS 内置的 sips 进行基础优化..."
    CONVERTER="sips"
fi

total=0
success=0

# 遍历所有图片文件
for f in "$INPUT_DIR"/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP} 2>/dev/null; do
    if [ -f "$f" ]; then
        filename=$(basename "$f")
        baseName="${filename%.*}"
        total=$((total + 1))

        echo "[$total] 处理: $filename"

        case $CONVERTER in
            cwebp)
                # 使用 cwebp 转换
                cwebp -q $QUALITY "$f" -o "$OUTPUT_DIR/${baseName}.webp" 2>/dev/null
                ;;
            imagemagick)
                # 使用 ImageMagick 转换
                convert "$f" -quality $QUALITY "$OUTPUT_DIR/${baseName}.webp" 2>/dev/null
                ;;
            sips)
                # macOS 内置 sips - 只能转换格式，无法指定 WebP 质量
                # 先复制原文件，保持原格式
                cp "$f" "$OUTPUT_DIR/$filename"
                ;;
        esac

        if [ $? -eq 0 ]; then
            success=$((success + 1))
            echo "    ✓ 完成"
        else
            echo "    ✗ 失败"
        fi
    fi
done

echo ""
echo "=== 优化完成 ==="
echo "成功: $success / $total"

# 显示体积对比
original_size=$(du -sh "$INPUT_DIR" | awk '{print $1}')
optimized_size=$(du -sh "$OUTPUT_DIR" | awk '{print $1}')
echo ""
echo "原始体积: $original_size"
echo "优化体积: $optimized_size"

if [ "$CONVERTER" = "sips" ]; then
    echo ""
    echo "⚠️  注意: 使用 sips 只进行了格式复制，未进行 WebP 压缩"
    echo "建议安装 webp 或 imagemagick 进行真正的优化："
    echo "  brew install webp"
fi
