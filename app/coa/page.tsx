import type { Metadata } from "next";
import CoaLibraryPage from "./CoaLibraryPage";

export const metadata: Metadata = {
  title: "COA Documents",
  description:
    "Review current COA document coverage by peptide family and request a product-, specification-, and batch-matched document.",
};

export default function CoaPage() {
  return <CoaLibraryPage />;
}
