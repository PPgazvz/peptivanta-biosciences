import type { Metadata } from "next";
import FulfillmentLedgerPage from "./FulfillmentLedgerPage";

export const metadata: Metadata = {
  title: "Recent Fulfillment",
  description:
    "A privacy-conscious view of recent B2B order and fulfillment activity across Peptivanta priority markets.",
};

export default function FulfillmentPage() {
  return <FulfillmentLedgerPage />;
}
