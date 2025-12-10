export const extractDominantColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    // For local images, we can't use canvas due to CORS
    // Instead, use predefined colors based on image name
    const colorMap: { [key: string]: string } = {
      "HeartBreaking.jpg": "rgba(139, 69, 19, 0.3)", // Brown/warm
      "Romantic.jpg": "rgba(255, 105, 180, 0.25)", // Pink
      "nobodygetsme.jpg": "rgba(70, 130, 180, 0.3)", // Steel blue
      "Artlife.jpg": "rgba(75, 0, 130, 0.25)", // Indigo
      "Summer.jpg": "rgba(255, 215, 0, 0.2)", // Gold
      "PinkBlue.jpg": "rgba(147, 112, 219, 0.25)", // Purple
      "entityLife.jpg": "rgba(0, 128, 128, 0.3)", // Teal
      "iambluegroove.jpg": "rgba(65, 105, 225, 0.3)", // Royal blue
    };

    // Extract filename from path
    const filename = imageSrc.split("/").pop() || "";
    const color = colorMap[filename] || "rgba(20, 20, 30, 0.3)";

    console.log("Extracted color for", filename, ":", color);
    resolve(color);
  });
};
