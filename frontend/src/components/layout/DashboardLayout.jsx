import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    Users,
    Menu as MenuIcon,
    LogOut,
    ChefHat,
    Star,
    Settings,
    ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const SidebarLink = ({ href, icon: Icon, children, active }) => (
    <Link
        to={href}
        className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium text-sm",
            active
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
    >
        <Icon className={cn("h-4 w-4", active ? "text-primary" : "group-hover:text-primary")} />
        {children}
    </Link>
);

const SidebarContent = ({ pathname }) => {
    const routes = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
        { href: "/menu", label: "Menu", icon: ChefHat },
        { href: "/cart", label: "Cart", icon: ShoppingCart },
        { href: "/orders", label: "Orders", icon: ShoppingBag },
        { href: "/reviews", label: "Reviews", icon: Star },
        { href: "/users", label: "Users", icon: Users }, // Admin only usually
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
                    {/* <UtensilsCrossed className="h-6 w-6 text-primary" /> */}
                    <span className="italic">ZAP</span>fest
                </h1>
            </div>
            <Separator />
            <nav className="flex-1 px-4 py-6 space-y-1">
                {routes.map((route) => (
                    <SidebarLink
                        key={route.href}
                        href={route.href}
                        icon={route.icon}
                        active={pathname === route.href}
                    >
                        {route.label}
                    </SidebarLink>
                ))}
            </nav>
            <div className="p-4 border-t border-border/40">
                <div className="bg-gradient-to-br from-primary/10 to-rose-500/10 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center gap-3">
                        <div className="bg-background/80 p-2 rounded-lg shadow-sm">
                            <ChefHat className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-foreground">Pro Plan</p>
                            <p className="text-[10px] text-muted-foreground">Active until Dec</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 h-screen">
                <SidebarContent pathname={location.pathname} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <MenuIcon className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 border-r border-border/40">
                                <SidebarContent pathname={location.pathname} />
                            </SheetContent>
                        </Sheet>
                        <span className="ml-3 font-bold text-lg md:hidden">ZAPfest</span>
                    </div>

                    <div className="flex-1" /> {/* Spacer */}

                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary">
                            Feedback
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-background shadow-sm hover:ring-primary/20 transition-all">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Admin User</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            admin@zapfest.com
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/profile')}>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/settings')}>
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
