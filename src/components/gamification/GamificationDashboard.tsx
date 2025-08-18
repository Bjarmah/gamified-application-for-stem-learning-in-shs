import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, Target, TrendingUp, Zap } from "lucide-react";
import { useGamification } from "@/hooks/use-gamification";
import XPBar from "./XPBar";
import LevelBadge from "./LevelBadge";
import AchievementsList from "./AchievementsList";
import BadgeCard from "@/components/achievements/BadgeCard";
import StreakCard from "@/components/dashboard/StreakCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";

const GamificationDashboard = () => {
  const { 
    gamificationData, 
    achievements, 
    badges, 
    xpHistory,
    loading 
  } = useGamification();

  if (loading || !gamificationData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const earnedAchievements = achievements.filter(a => a.earned_at);
  const earnedBadges = badges.filter(b => b.earned_at);
  const recentXP = xpHistory.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-stem">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold text-stemPurple">
                  {gamificationData.total_xp.toLocaleString()}
                </p>
              </div>
              <Zap className="h-8 w-8 text-stemPurple" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stem">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <LevelBadge level={gamificationData.current_level} size="lg" />
              </div>
              <TrendingUp className="h-8 w-8 text-stemGreen" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stem">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-stemYellow">
                  {earnedAchievements.length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-stemYellow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stem">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold text-stemOrange">
                  {earnedBadges.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-stemOrange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <XPBar 
        currentXP={gamificationData.total_xp % ((gamificationData.current_level * gamificationData.current_level) * 100)}
        totalXP={gamificationData.total_xp}
        level={gamificationData.current_level}
        nextLevelXP={(gamificationData.current_level * gamificationData.current_level) * 100}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StreakCard />
            
            <Card className="card-stem">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-stemPurple" />
                  Progress Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Modules Completed</span>
                  <span className="font-semibold">{gamificationData.modules_completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Quizzes Taken</span>
                  <span className="font-semibold">{gamificationData.quizzes_completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Perfect Scores</span>
                  <span className="font-semibold">{gamificationData.perfect_scores}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Time Studied</span>
                  <span className="font-semibold">
                    {Math.floor(gamificationData.total_time_studied / 60)}h {gamificationData.total_time_studied % 60}m
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent XP Activity */}
          {recentXP.length > 0 && (
            <Card className="card-stem">
              <CardHeader>
                <CardTitle>Recent XP Activity</CardTitle>
                <CardDescription>Your latest learning achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentXP.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{transaction.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                          {new Date(transaction.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="font-bold text-stemPurple">
                        +{transaction.amount} XP
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementsList achievements={achievements} loading={loading} />
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Badge Collection</h3>
            {badges.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No badges yet</p>
                  <p className="text-xs text-muted-foreground">Complete achievements to earn badges!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    id={badge.id}
                    name={badge.name}
                    description={badge.description}
                    icon={<Award className="h-8 w-8 text-white" />}
                    isUnlocked={!!badge.earned_at}
                    level={badge.level}
                    rarity={badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1) as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeaderboardCard type="global" limit={10} />
            <LeaderboardCard type="school" limit={10} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;