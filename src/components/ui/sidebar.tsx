
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("h-screen flex flex-col border-r bg-background", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-4 border-b", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto py-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-4 border-t mt-auto", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-3 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarGroup.displayName = "SidebarGroup";

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-1", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-1", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarMenu.displayName = "SidebarMenu";

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  active?: boolean;
  children?: React.ReactNode;
}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarMenuItem.displayName = "SidebarMenuItem";

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  active?: boolean;
  children?: React.ReactNode;
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, active, children, asChild, ...props }, ref) => {
    // Fix the error by properly handling the asChild prop
    return (
      <>
        {asChild ? (
          <div
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium w-full",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              className
            )}
            {...props}
          >
            {children}
          </div>
        ) : (
          <button
            ref={ref}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium w-full",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              className
            )}
            {...props}
          >
            {children}
          </button>
        )}
      </>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }
>(({ className, active, children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium w-full",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
});
SidebarMenuLink.displayName = "SidebarMenuLink";

const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const SidebarTrigger: React.FC = () => {
  return null;
};

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuLink,
  SidebarProvider,
  SidebarTrigger,
};
