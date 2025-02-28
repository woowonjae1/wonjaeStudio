import { FC } from 'react';
import { Album } from '@/types';
import AlbumCard from '../album/AlbumCard';


interface AlbumGridProps {
  onPlayAlbum: (album: Album) => void;
  albums: Album[];
  
}

const AlbumGrid: FC<AlbumGridProps> = ({ onPlayAlbum, albums}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          onPlay={onPlayAlbum}
        />
      ))}
    </div>
  );
};

export default AlbumGrid;