import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardUser {
  user_id: string;
  full_name: string;
  school: string;
  total_xp: number;
  current_level: number;
  rank: number;
  avatar_initials: string;
  is_current_user?: boolean;
}

export function useLeaderboard() {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardUser[]>([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserSchool, setCurrentUserSchool] = useState<string | null>(null);

  const fetchLeaderboard = async (filterBySchool = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First get user gamification data
      const { data: gamificationData, error: gamificationError } = await supabase
        .from('user_gamification')
        .select('user_id, total_xp, current_level')
        .order('total_xp', { ascending: false })
        .limit(100);

      if (gamificationError) throw gamificationError;

      if (!gamificationData) return [];

      // Then get profile data for these users
      const userIds = gamificationData.map(item => item.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, school')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      let formattedData = gamificationData.map((item, index) => {
        const profile = profilesData?.find(p => p.id === item.user_id);
        return {
          user_id: item.user_id,
          full_name: profile?.full_name || 'Anonymous',
          school: profile?.school || 'Unknown School',
          total_xp: item.total_xp,
          current_level: item.current_level,
          rank: index + 1,
          avatar_initials: getInitials(profile?.full_name || 'Anonymous'),
          is_current_user: item.user_id === user.id
        };
      });

      // Filter by school if needed
      if (filterBySchool && currentUserSchool) {
        formattedData = formattedData.filter(item => item.school === currentUserSchool);
        // Recalculate ranks after filtering
        formattedData = formattedData.map((item, index) => ({
          ...item,
          rank: index + 1
        }));
      }

      return formattedData;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const fetchCurrentUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('school')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setCurrentUser(user.id);
      setCurrentUserSchool(data?.school || null);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const loadLeaderboards = async () => {
    setLoading(true);
    
    await fetchCurrentUserInfo();
    
    const [global, school] = await Promise.all([
      fetchLeaderboard(false),
      fetchLeaderboard(true)
    ]);

    setGlobalLeaderboard(global);
    setSchoolLeaderboard(school);
    setLoading(false);
  };

  useEffect(() => {
    loadLeaderboards();
  }, [currentUserSchool]);

  const getCurrentUserRank = (leaderboard: LeaderboardUser[]) => {
    const userEntry = leaderboard.find(entry => entry.is_current_user);
    return userEntry ? userEntry.rank : null;
  };

  const getTopUsers = (leaderboard: LeaderboardUser[], count = 10) => {
    return leaderboard.slice(0, count);
  };

  return {
    globalLeaderboard,
    schoolLeaderboard,
    loading,
    getCurrentUserRank,
    getTopUsers,
    refreshLeaderboard: loadLeaderboards
  };
}