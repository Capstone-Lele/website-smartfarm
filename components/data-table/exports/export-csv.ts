  
import { mkConfig, generateCsv, download } from "export-to-csv";

  export const ExportCsv = (
    {columns, data} : {columns: any; data: any}
  ) => {
    console.log("Exporting CSV", { columns, data });
    // return;
    const fileName = `data-export-${new Date().toLocaleDateString()}`;
    const csvConfig = mkConfig({
      columnHeaders: columns,
      filename: fileName,
    });

    const csvOutput = generateCsv(csvConfig)(data);
    download(csvConfig)(csvOutput);
  };

