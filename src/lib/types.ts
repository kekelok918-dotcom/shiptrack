import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export type Tag = "feature" | "fix" | "improvement";
export type FeatureStatus = "open" | "planned" | "shipped" | "declined";

export interface ChangelogEntry {
  id: string;
  productId: string;
  title: string;
  body: string;
  tag: Tag;
  createdAt: Date;
}

export interface FeatureRequest {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  status: FeatureStatus;
  createdAt: Date;
  votes: number;
}

export interface Product {
  id: string;
  userId: string;
  slug: string;
  name: string;
  description: string | null;
  subdomain: string;
  createdAt: Date;
}
