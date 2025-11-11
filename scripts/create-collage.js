const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// 图片文件路径
const imageDir = path.join(__dirname, "../public/image/newalbum");
const images = [
  "woowonjae.jpg",
  "SZA.jpg",
  "XIAH.jpg",
  "daniel caesar.jpg",
  "daniel caesar2.jpg",
  "daniel caesar3.jpg",
  "keshi.jpg",
  "art life.jpg",
  "宁艺卓.jpg",
];

const imageSize = 200; // 每张图片的大小 (200x200px)
const gridSize = 3; // 3x3 网格
const totalSize = imageSize * gridSize; // 最终图片大小 (600x600px)

async function createCollage() {
  try {
    console.log("开始创建拼图...");

    // 处理所有图片，确保它们都是相同大小和格式
    const processedImages = [];

    for (let i = 0; i < images.length; i++) {
      const imagePath = path.join(imageDir, images[i]);

      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️  文件不存在: ${imagePath}`);
        continue;
      }

      console.log(`处理第 ${i + 1}/9 张图片: ${images[i]}`);

      // 读取、调整大小并转换为 JPEG
      const buffer = await sharp(imagePath)
        .resize(imageSize, imageSize, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      processedImages.push(buffer);
    }

    if (processedImages.length !== 9) {
      throw new Error(`只找到 ${processedImages.length} 张图片，需要 9 张`);
    }

    // 创建 3x3 网格的 SVG 布局
    console.log("创建拼图布局...");

    const svgImage = sharp({
      create: {
        width: totalSize,
        height: totalSize,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    });

    // 创建 composite 操作数组
    const compositeOperations = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col;
        const left = col * imageSize;
        const top = row * imageSize;

        compositeOperations.push({
          input: processedImages[index],
          left: left,
          top: top,
        });
      }
    }

    // 进行 composite 操作
    const outputBuffer = await svgImage
      .composite(compositeOperations)
      .jpeg({ quality: 95 })
      .toFile(path.join(__dirname, "../public/image/collage.jpg"));

    console.log("✅ 拼图创建成功!");
    console.log(`📁 输出文件: ${outputBuffer.path}`);
    console.log(`📊 尺寸: ${outputBuffer.width}x${outputBuffer.height}px`);
    console.log(`💾 文件大小: ${(outputBuffer.size / 1024).toFixed(2)}KB`);
  } catch (error) {
    console.error("❌ 错误:", error.message);
    process.exit(1);
  }
}

createCollage();
