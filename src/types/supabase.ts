export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      albums: {
        Row: {
          id: string
          title: string
          artist: string
          cover_url: string | null
          audio_url: string | null
          release_date: string | null
          description: string | null
          genre: string | null
          metadata: Json
          plays_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist?: string
          cover_url?: string | null
          audio_url?: string | null
          release_date?: string | null
          description?: string | null
          genre?: string | null
          metadata?: Json
          plays_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          cover_url?: string | null
          audio_url?: string | null
          release_date?: string | null
          description?: string | null
          genre?: string | null
          metadata?: Json
          plays_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          album_id: string | null
          title: string
          duration: string | null
          track_number: number | null
          audio_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          album_id?: string | null
          title: string
          duration?: string | null
          track_number?: number | null
          audio_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          album_id?: string | null
          title?: string
          duration?: string | null
          track_number?: number | null
          audio_url?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          category: string | null
          content: string | null
          excerpt: string | null
          cover_image: string | null
          author_id: string | null
          published_at: string | null
          is_published: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category?: string | null
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          author_id?: string | null
          published_at?: string | null
          is_published?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string | null
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          author_id?: string | null
          published_at?: string | null
          is_published?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          user_id: string | null
          item_type: 'album' | 'post' | 'track'
          item_id: string
          parent_id: string | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id?: string | null
          item_type: 'album' | 'post' | 'track'
          item_id: string
          parent_id?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string | null
          item_type?: 'album' | 'post' | 'track'
          item_id?: string
          parent_id?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string | null
          item_type: 'album' | 'post' | 'track'
          item_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          item_type: 'album' | 'post' | 'track'
          item_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          item_type?: 'album' | 'post' | 'track'
          item_id?: string
          created_at?: string
        }
      }
      play_history: {
        Row: {
          id: string
          user_id: string | null
          album_id: string | null
          track_id: string | null
          played_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          album_id?: string | null
          track_id?: string | null
          played_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          album_id?: string | null
          track_id?: string | null
          played_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

