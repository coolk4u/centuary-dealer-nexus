
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Users, 
  FileText, 
  BarChart3, 
  Receipt, 
  User, 
  Settings,
  Truck,
  Shield,
  Target,
  Percent,
  Warehouse
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Product Catalog", url: "/catalog", icon: Package },
  { title: "Shopping Cart", url: "/cart", icon: ShoppingCart },
  { title: "Orders", url: "/orders", icon: ClipboardList },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "GRN Process", url: "/grn", icon: Truck },
  { title: "Inventory", url: "/inventory", icon: Warehouse },
  { title: "Warranty Registration", url: "/warranty", icon: Shield },
  { title: "Sales & Billing", url: "/sales", icon: BarChart3 },
  { title: "Price List", url: "/price-list", icon: FileText },
  { title: "Targets", url: "/targets", icon: Target },
  { title: "Discounts", url: "/discounts", icon: Percent },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Invoices", url: "/invoices", icon: Receipt },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-white font-bold text-lg">Centuary</h1>
              <p className="text-white/70 text-sm">Dealer Portal</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-wide mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`
                      rounded-lg transition-all duration-200 hover:bg-white/10
                      ${isActive(item.url) 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/80 hover:text-white'
                      }
                    `}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
