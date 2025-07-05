import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchButton = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <>
      {/* Desktop search button */}
      <div className="hidden md:flex items-center">
        <Button
          variant="outline"
          onClick={handleSearchClick}
          className="relative h-9 w-9 p-0 mr-2 md:h-10 md:w-60 md:justify-start md:px-3 md:py-2"
        >
          <Search className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline-flex">Advanced Search</span>
        </Button>
      </div>

      {/* Mobile search button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-stemPurple-dark"
          onClick={handleSearchClick}
        >
          <Search size={20} />
        </Button>
      </div>
    </>
  );
};

export default SearchButton;