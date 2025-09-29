import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  Monitor, 
  Volume2, 
  VolumeX,
  Smartphone,
  Download,
  Trash2,
  RefreshCw,
  Shield,
  Database,
  Zap,
  Eye,
  EyeOff,
  Palette,
  Globe,
  HelpCircle
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { FloatingAIChatbot } from '@/components/ai-chatbot';

interface SettingsState {
  notifications: {
    studyReminders: boolean;
    achievementAlerts: boolean;
    weeklyProgress: boolean;
    aiInsights: boolean;
    roomUpdates: boolean;
    pushNotifications: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: number;
    reducedMotion: boolean;
    highContrast: boolean;
    compactMode: boolean;
  };
  learning: {
    autoAdvance: boolean;
    showHints: boolean;
    pauseOnBlur: boolean;
    soundEffects: boolean;
    vibration: boolean;
    difficultyAdaptation: boolean;
  };
  privacy: {
    analyticsTracking: boolean;
    profileVisibility: 'public' | 'friends' | 'private';
    shareProgress: boolean;
    dataRetention: boolean;
  };
  system: {
    offlineMode: boolean;
    dataSync: boolean;
    cacheSize: number;
    backgroundSync: boolean;
  };
}

const Settings: React.FC = () => {
  const { theme } = useTheme();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { isMobile, vibrate } = useMobileUtils();

  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      studyReminders: true,
      achievementAlerts: true,
      weeklyProgress: true,
      aiInsights: true,
      roomUpdates: true,
      pushNotifications: isMobile,
    },
    appearance: {
      theme: 'system',
      fontSize: 16,
      reducedMotion: false,
      highContrast: false,
      compactMode: false,
    },
    learning: {
      autoAdvance: true,
      showHints: true,
      pauseOnBlur: true,
      soundEffects: true,
      vibration: isMobile,
      difficultyAdaptation: true,
    },
    privacy: {
      analyticsTracking: true,
      profileVisibility: 'public',
      shareProgress: true,
      dataRetention: true,
    },
    system: {
      offlineMode: false,
      dataSync: true,
      cacheSize: 100,
      backgroundSync: true,
    },
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const updateSetting = <T extends keyof SettingsState>(
    category: T,
    key: keyof SettingsState[T],
    value: any
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    saveSettings(newSettings);
    vibrate(25);
  };

  const resetToDefaults = () => {
    localStorage.removeItem('userSettings');
    window.location.reload();
  };

  const clearAppData = () => {
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    toast({
      title: "Data cleared",
      description: "All app data has been cleared. Please refresh the page.",
      variant: "destructive",
    });
  };

  const getStorageInfo = () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const used = (estimate.usage || 0) / (1024 * 1024);
        const quota = (estimate.quota || 0) / (1024 * 1024);
        console.log(`Storage: ${used.toFixed(2)}MB / ${quota.toFixed(2)}MB`);
      });
    }
  };

  useEffect(() => {
    getStorageInfo();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Customize your learning experience</p>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Learning</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose what notifications you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {key === 'studyReminders' && 'Get reminded about your daily study goals'}
                        {key === 'achievementAlerts' && 'Be notified when you earn new achievements'}
                        {key === 'weeklyProgress' && 'Receive weekly progress summaries'}
                        {key === 'aiInsights' && 'Get AI-powered learning insights and recommendations'}
                        {key === 'roomUpdates' && 'Stay updated about your study room activities'}
                        {key === 'pushNotifications' && 'Enable browser push notifications'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        updateSetting('notifications', key as keyof typeof settings.notifications, checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Display
                </CardTitle>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select 
                    value={settings.appearance.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      updateSetting('appearance', 'theme', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size: {settings.appearance.fontSize}px</Label>
                  <Slider
                    value={[settings.appearance.fontSize]}
                    onValueChange={([value]) => updateSetting('appearance', 'fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Reduced Motion</Label>
                      <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                    </div>
                    <Switch
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => updateSetting('appearance', 'reducedMotion', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>High Contrast</Label>
                      <p className="text-xs text-muted-foreground">Increase color contrast for better visibility</p>
                    </div>
                    <Switch
                      checked={settings.appearance.highContrast}
                      onCheckedChange={(checked) => updateSetting('appearance', 'highContrast', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Mode</Label>
                      <p className="text-xs text-muted-foreground">Use smaller spacing for more content</p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Learning Preferences
                </CardTitle>
                <CardDescription>
                  Optimize your learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.learning).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {key === 'autoAdvance' && 'Automatically move to next lesson after completion'}
                        {key === 'showHints' && 'Display helpful hints during quizzes and activities'}
                        {key === 'pauseOnBlur' && 'Pause timers when switching tabs or apps'}
                        {key === 'soundEffects' && 'Play sounds for interactions and achievements'}
                        {key === 'vibration' && 'Use haptic feedback on mobile devices'}
                        {key === 'difficultyAdaptation' && 'Automatically adjust difficulty based on performance'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        updateSetting('learning', key as keyof typeof settings.learning, checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Data
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select 
                    value={settings.privacy.profileVisibility} 
                    onValueChange={(value: 'public' | 'friends' | 'private') => 
                      updateSetting('privacy', 'profileVisibility', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Public - Anyone can see your profile
                        </div>
                      </SelectItem>
                      <SelectItem value="friends">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Friends - Only study room members can see
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4" />
                          Private - Only you can see your profile
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics Tracking</Label>
                      <p className="text-xs text-muted-foreground">Help improve the app with anonymous usage data</p>
                    </div>
                    <Switch
                      checked={settings.privacy.analyticsTracking}
                      onCheckedChange={(checked) => updateSetting('privacy', 'analyticsTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Share Progress</Label>
                      <p className="text-xs text-muted-foreground">Allow others to see your learning achievements</p>
                    </div>
                    <Switch
                      checked={settings.privacy.shareProgress}
                      onCheckedChange={(checked) => updateSetting('privacy', 'shareProgress', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Retention</Label>
                      <p className="text-xs text-muted-foreground">Keep learning data for personalized recommendations</p>
                    </div>
                    <Switch
                      checked={settings.privacy.dataRetention}
                      onCheckedChange={(checked) => updateSetting('privacy', 'dataRetention', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System & Storage
                  </CardTitle>
                  <CardDescription>
                    Manage app performance and storage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Offline Mode</Label>
                        <p className="text-xs text-muted-foreground">Download content for offline access</p>
                      </div>
                      <Switch
                        checked={settings.system.offlineMode}
                        onCheckedChange={(checked) => updateSetting('system', 'offlineMode', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Sync</Label>
                        <p className="text-xs text-muted-foreground">Sync progress across devices</p>
                      </div>
                      <Switch
                        checked={settings.system.dataSync}
                        onCheckedChange={(checked) => updateSetting('system', 'dataSync', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Background Sync</Label>
                        <p className="text-xs text-muted-foreground">Update content in the background</p>
                      </div>
                      <Switch
                        checked={settings.system.backgroundSync}
                        onCheckedChange={(checked) => updateSetting('system', 'backgroundSync', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Cache Size: {settings.system.cacheSize}MB</Label>
                    <Slider
                      value={[settings.system.cacheSize]}
                      onValueChange={([value]) => updateSetting('system', 'cacheSize', value)}
                      min={50}
                      max={500}
                      step={50}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher cache improves performance but uses more storage
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Reset settings or clear app data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" onClick={resetToDefaults} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                    <Button variant="destructive" onClick={clearAppData} className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Warning: Clearing data will remove all offline content and settings
                  </p>
                </CardContent>
              </Card>

              {isMobile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Mobile Features
                    </CardTitle>
                    <CardDescription>
                      Mobile-specific features and optimizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Install as App</Label>
                        <p className="text-xs text-muted-foreground">Add to home screen for better experience</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Install
                      </Button>
                    </div>
                    
                    {settings.learning.vibration && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Smartphone className="h-4 w-4" />
                          <span className="text-sm font-medium">Haptic Feedback Enabled</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your device will vibrate for interactions and notifications
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Settings auto-save as you change them</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                Need help?
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingAIChatbot />
    </div>
  );
};

export default Settings;