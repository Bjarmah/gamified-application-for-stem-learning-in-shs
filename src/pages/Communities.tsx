
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Users } from 'lucide-react';
import CommunityCard from '@/components/community/CommunityCard';
import CommunityPostCard, { CommunityPostProps } from '@/components/community/CommunityPostCard';
import { useToast } from "@/hooks/use-toast";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  isMember?: boolean;
}

const Communities = () => {
  const { toast } = useToast();
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
  });

  // Demo data - would come from API in a real app
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 'physics-lovers',
      name: 'Physics Lovers',
      description: 'A community for physics enthusiasts to share insights, ask questions, and discuss physics concepts.',
      memberCount: 356,
      imageUrl: '/placeholder.svg',
      isMember: true,
    },
    {
      id: 'chemistry-club',
      name: 'Chemistry Club',
      description: 'Join us to explore chemical reactions, periodic table mysteries, and latest chemistry research.',
      memberCount: 248,
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'math-masters',
      name: 'Math Masters',
      description: 'For students who enjoy mathematics, problem-solving, and mathematical puzzles.',
      memberCount: 412,
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'biology-buffs',
      name: 'Biology Buffs',
      description: 'Discuss genetics, ecology, human biology and more with fellow biology enthusiasts.',
      memberCount: 189,
      imageUrl: '/placeholder.svg',
      isMember: true,
    }
  ]);

  // Demo posts
  const [posts, setPosts] = useState<CommunityPostProps[]>([
    {
      id: 'post-1',
      title: 'Help with Newtons Laws of Motion',
      content: "I'm struggling to understand the practical implications of Newton's Third Law. Can someone explain with examples?",
      author: {
        id: 'user-1',
        name: 'Kwame Asante',
        avatar: '/placeholder.svg'
      },
      createdAt: new Date('2023-05-15T10:30:00'),
      commentCount: 12,
      likeCount: 24,
      isLiked: true
    },
    {
      id: 'post-2',
      title: 'Great chemistry resources',
      content: "I found this amazing website that explains bonding really well. Sharing the link here for everyone interested in organic chemistry.",
      author: {
        id: 'user-2',
        name: 'Ama Boateng',
        avatar: '/placeholder.svg'
      },
      createdAt: new Date('2023-05-14T15:20:00'),
      commentCount: 5,
      likeCount: 18
    },
    {
      id: 'post-3',
      title: 'Study group for calculus exam',
      content: "Anyone interested in forming a study group for the upcoming calculus exam? We can meet online or at the library.",
      author: {
        id: 'user-3',
        name: 'Kofi Mensah',
        avatar: '/placeholder.svg'
      },
      createdAt: new Date('2023-05-13T09:45:00'),
      commentCount: 20,
      likeCount: 15
    }
  ]);

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(communities.map(community => 
      community.id === communityId 
        ? { ...community, isMember: true, memberCount: community.memberCount + 1 }
        : community
    ));
    
    toast({
      title: "Joined Community",
      description: "You have successfully joined this community."
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 }
        : post
    ));
  };

  const handleCreateCommunity = () => {
    if (newCommunity.name.trim() && newCommunity.description.trim()) {
      const newCommunityItem: Community = {
        id: `community-${Date.now()}`,
        name: newCommunity.name,
        description: newCommunity.description,
        memberCount: 1,
        isMember: true,
      };
      
      setCommunities([...communities, newCommunityItem]);
      
      setNewCommunity({
        name: '',
        description: '',
      });
      
      toast({
        title: "Community Created",
        description: `${newCommunity.name} has been created successfully.`
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground">
            Join learning communities and collaborate with peers.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Community</DialogTitle>
              <DialogDescription>
                Create a new learning community to connect with students and teachers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="community-name" className="text-sm font-medium">
                  Community Name
                </label>
                <Input
                  id="community-name"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                  placeholder="E.g., Physics Study Group"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="community-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="community-description"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                  placeholder="Describe the purpose of your community"
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleCreateCommunity}
                disabled={!newCommunity.name.trim() || !newCommunity.description.trim()}
              >
                Create Community
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search communities..." 
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Communities</TabsTrigger>
          <TabsTrigger value="my">My Communities</TabsTrigger>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                description={community.description}
                memberCount={community.memberCount}
                imageUrl={community.imageUrl}
                isMember={community.isMember}
                onJoin={handleJoinCommunity}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {communities
              .filter(community => community.isMember)
              .map((community) => (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  description={community.description}
                  memberCount={community.memberCount}
                  imageUrl={community.imageUrl}
                  isMember={true}
                />
              ))}
              
            {communities.filter(community => community.isMember).length === 0 && (
              <div className="col-span-full text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No communities joined</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't joined any communities yet.
                </p>
                <Button variant="outline" onClick={() => document.querySelector('[value="all"]')?.dispatchEvent(new Event('click'))}>
                  Explore Communities
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  {...post}
                  onLike={handleLikePost}
                />
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-semibold mb-3">My Communities</h3>
                <div className="space-y-2">
                  {communities
                    .filter(community => community.isMember)
                    .map((community) => (
                      <div key={community.id} className="flex items-center gap-2 py-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={community.imageUrl} alt={community.name} />
                          <AvatarFallback>{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{community.name}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">Physics</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Chemistry</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Mathematics</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Biology</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communities;
