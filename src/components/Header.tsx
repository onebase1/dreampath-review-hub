
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  pendingCount: number;
}

const Header = ({ pendingCount }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-dreampath-dark-purple">Dreampath Review</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 bg-dreampath-red text-white text-xs flex items-center justify-center"
              variant="outline"
            >
              {pendingCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
