import { FC } from "react";
import { Album } from "@/types";
import ThreeJSAlbumRenderer from "./ThreeJSAlbumRenderer";

interface AlbumCardProps {
  album: Album;
  onPlay: (album: Album) => void;  // 添加 onPlay 属性
}

const AlbumCard: FC<AlbumCardProps> = ({ album, onPlay }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-[300px]">
        <ThreeJSAlbumRenderer imageSrc={album.coverUrl} />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{album.title}</h3>
        <p className="text-gray-600">{album.artist}</p>
        <button
          onClick={() => onPlay(album)}
          className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Play
        </button>
      </div>
    </div>
  );
};


export default AlbumCard;