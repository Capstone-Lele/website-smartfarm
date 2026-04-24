"use client";
import { useParams, useSearchParams } from "next/navigation";
import DetailInventoryNotes from "./detail-inventory-notes";
import DetailInventorySubmissionNotes from "./detail-inventory-submission-notes";
import DetailConsumptionNotes from "./detail-consumtion-notes";

const page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const source = searchParams.get("source");
  const idSource = searchParams.get("inventoryId") || "";// notes id
  const idInventory = id?.toString() || ""; // inventaris id

  return (
    <div>
      {source === "inventory-notes" && <DetailInventoryNotes id={idInventory} source={idSource} />}
      {source === "inventory-submission" && <DetailInventorySubmissionNotes id={idInventory} source={idSource} />}
      {source === "inventory-consumption" && <DetailConsumptionNotes id={idInventory} source={idSource} />}
    </div>
  );
};

export default page;
