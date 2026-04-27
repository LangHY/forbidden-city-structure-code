#!/bin/bash

# 故宫斗拱模型批量压缩脚本
# 使用 Draco 算法压缩 GLB 模型

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

INPUT_DIR="$PROJECT_ROOT/public/models/structures"
OUTPUT_DIR="$PROJECT_ROOT/public/models/compressed"
COMPRESSION_LEVEL=${COMPRESSION_LEVEL:-7}

echo "=== 故宫斗拱模型压缩 ==="
echo "输入目录: $INPUT_DIR"
echo "输出目录: $OUTPUT_DIR"
echo "压缩级别: $COMPRESSION_LEVEL"
echo ""

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 统计变量
total=0
success=0

# 遍历所有 GLB 文件
for f in "$INPUT_DIR"/*.glb; do
    if [ -f "$f" ]; then
        filename=$(basename "$f")
        total=$((total + 1))

        echo "[$total] 压缩: $filename ..."

        # 使用 npx 运行 gltf-pipeline（无需预安装）
        if npx gltf-pipeline -i "$f" -o "$OUTPUT_DIR/$filename" --draco.compressionLevel=$COMPRESSION_LEVEL 2>/dev/null; then
            # 显示压缩效果
            original_size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
            compressed_size=$(stat -f%z "$OUTPUT_DIR/$filename" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$filename")
            reduction=$(awk "BEGIN {printf \"%.1f\", (1 - $compressed_size/$original_size) * 100}")

            echo "    ✓ 完成！压缩率: ${reduction}%"
            success=$((success + 1))
        else
            echo "    ✗ 压缩失败: $filename"
        fi
    fi
done

echo ""
echo "=== 压缩完成 ==="
echo "成功: $success / $total"

# 显示总体积对比
original_total=$(du -sh "$INPUT_DIR" | awk '{print $1}')
compressed_total=$(du -sh "$OUTPUT_DIR" | awk '{print $1}')
echo "原始体积: $original_total"
echo "压缩体积: $compressed_total"
