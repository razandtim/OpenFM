// Supabase authentication and preferences syncing

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { UserPreferences, PlayerSettings } from './types';

export interface AuthUser {
  id: string;
  email?: string;
}

export class OpenFMAuth {
  private supabase: SupabaseClient | null = null;
  private currentUser: AuthUser | null = null;

  constructor(
    private supabaseUrl?: string,
    private supabaseAnonKey?: string
  ) {
    if (supabaseUrl && supabaseAnonKey) {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
      this.checkSession();
    }
  }

  private async checkSession(): Promise<void> {
    if (!this.supabase) return;

    try {
      const { data } = await this.supabase.auth.getSession();
      if (data.session) {
        this.currentUser = {
          id: data.session.user.id,
          email: data.session.user.email,
        };
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async signOut(): Promise<void> {
    if (!this.supabase) return;

    try {
      await this.supabase.auth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isSignedIn(): boolean {
    return this.currentUser !== null;
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    if (!this.supabase || !this.currentUser) return;

    try {
      const { error } = await this.supabase
        .from('user_preferences')
        .upsert({
          user_id: this.currentUser.id,
          preferences: JSON.stringify(preferences),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving preferences:', error);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  async loadPreferences(): Promise<UserPreferences | null> {
    if (!this.supabase || !this.currentUser) return null;

    try {
      const { data, error } = await this.supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', this.currentUser.id)
        .single();

      if (error || !data) {
        return null;
      }

      return JSON.parse(data.preferences) as UserPreferences;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  }
}

export function getDefaultSettings(): PlayerSettings {
  return {
    crossfadeDuration: 250,
    targetVolume: -10,
    duckLevel: -20,
    duckAttack: 10,
    duckRelease: 250,
    autoRescan: true,
    showOverlay: false,
    playbackMode: 'shuffle',
    loop: true,
  };
}

