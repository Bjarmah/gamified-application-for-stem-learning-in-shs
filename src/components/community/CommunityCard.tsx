
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  isMember?: boolean;
  onJoin?: (id: string) => void;
}

const CommunityCard = ({
  id,
  name,
  description,
  memberCount,
  imageUrl,
  isMember = false,
  onJoin
}: CommunityCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              <Link to={`/communities/${id}`} className="hover:underline">
                {name}
              </Link>
            </CardTitle>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users size={12} className="mr-1" />
              <span>{memberCount} members</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        {isMember ? (
          <Button variant="outline" size="sm" className="w-full">
            View Community
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onJoin && onJoin(id)}
          >
            Join Community
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
