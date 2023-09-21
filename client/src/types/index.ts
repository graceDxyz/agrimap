import { type Icons } from "@/components/icons";
import { DrawEventType } from "@mapbox/mapbox-gl-draw";

export type Mode = "view" | "create" | "update" | "delete";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  audience?: Array<Role>;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface Message {
  message: string;
}

export interface DialogHeaderDetail {
  title: string;
  description?: string;
  form?: JSX.Element;
}

export type DrawEvent = {
  features: GeoJSON.Feature<GeoJSON.Polygon>[];
  action: DrawEventType;
  points: number;
};
