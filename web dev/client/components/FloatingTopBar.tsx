import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

interface FloatingTopBarProps {
  isCollapsed?: boolean;
}

export const FloatingTopBar = ({
  isCollapsed = false,
}: FloatingTopBarProps) => {
  // Top bar is disabled per user request
  return null;
};
