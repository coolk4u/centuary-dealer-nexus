import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, User, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
export function Header() {
  const navigate = useNavigate();
  return <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="text-xl font-bold text-blue-600">Centuary Dealer Portal</div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative" onClick={() => navigate('/cart')}>
          <ShoppingCart className="h-4 w-4" />
          <Badge className="absolute top-1 -right-1 h-2 w-2 p-0 text-xs"></Badge>
        </Button>
        
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          {/* <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs mx-[24px] py-[20px]"></Badge> */}
        </Button>
        
        <Button variant="outline" size="icon" onClick={() => navigate('/profile')}>
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>;
}