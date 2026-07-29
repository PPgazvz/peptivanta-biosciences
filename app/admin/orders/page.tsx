import type { Metadata } from "next";
import AdminOrdersPage from "./AdminOrdersPage";

export const metadata: Metadata = {
  title: "Fulfillment Admin",
  description: "Private order management for Peptivanta Biosciences.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OrdersAdminRoute() {
  return <AdminOrdersPage />;
}
