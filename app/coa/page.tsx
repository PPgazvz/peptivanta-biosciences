import type { Metadata } from "next";
import CoaLibraryPage from "./CoaLibraryPage";

export const metadata: Metadata = {
  title: "Analytical Report Library",
  description:
    "Browse peptide analytical reports organised by product name, then request the document matched to the current specification and batch.",
};

export default function CoaPage() {
  return <CoaLibraryPage />;
}
