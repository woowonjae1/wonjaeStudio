import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Album = Database['public']['Tables']['albums']['Row'];
type AlbumInsert = Database['public']['Tables']['albums']['Insert'];
type Post = Database['public']['Tables']['posts']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];
type Favorite = Database['public']['Tables']['favorites']['Row'];
type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];

// ============ Albums ============

export async function getAlbums() {
  const { data, error } = await supabase
    .from('albums')
    .select('*, tracks(*)')
    .order('release_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAlbumBySlug(id: string) {
  const { data, error } = await supabase
    .from('albums')
    .select('*, tracks(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAlbum(album: AlbumInsert) {
  const { data, error } = await supabaseAdmin
    .from('albums')
    .insert(album)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function incrementAlbumPlays(albumId: string) {
  const { data, error } = await supabase
    .from('albums')
    .update({ plays_count: supabase.rpc('increment') })
    .eq('id', albumId);

  if (error) throw error;
  return data;
}

// ============ Posts ============

export async function getPosts(limit = 10) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) throw error;
  return data;
}

// ============ Comments ============

export async function getComments(itemType: string, itemId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createComment(comment: CommentInsert) {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select('*, profiles(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

// ============ Favorites ============

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function addFavorite(favorite: FavoriteInsert) {
  const { data, error } = await supabase
    .from('favorites')
    .insert(favorite)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(favoriteId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId);

  if (error) throw error;
}

export async function isFavorited(userId: string, itemType: string, itemId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// ============ Play History ============

export async function addPlayHistory(userId: string, albumId: string, trackId?: string) {
  const { data, error } = await supabase
    .from('play_history')
    .insert({
      user_id: userId,
      album_id: albumId,
      track_id: trackId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPlayHistory(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('play_history')
    .select('*, albums(*), tracks(*)')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ============ Storage ============

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
}

