
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import GlobalSearch from "@/components/search/GlobalSearch";
import { useNavigate } from "react-router-dom";

const SearchButton = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Function to open command dialog
  const openSearch = () => setIsSearchOpen(true);

  // Keyboard shortcut for command dialog (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(prevOpen => !prevOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Open search page for mobile
  const openSearchPage = () => {
    navigate("/search");
  };

  return (
    <>
      {/* Desktop search button */}
      <div className="hidden md:flex items-center">
        <Button
          variant="outline"
          onClick={openSearch}
          className="relative h-9 w-9 p-0 mr-2 md:h-10 md:w-60 md:justify-start md:px-3 md:py-2"
        >
          <Search className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline-flex">Search...</span>
          <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground ml-auto">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Mobile search button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-stemPurple-dark"
          onClick={openSearchPage}
        >
          <Search size={20} />
        </Button>
      </div>

      {/* Global search dialog */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default SearchButton;
