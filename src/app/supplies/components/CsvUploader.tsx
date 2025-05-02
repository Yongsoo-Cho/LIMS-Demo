"use client";

import { useState, useEffect } from "react";
import { parseCsv, generateTableData, TableData } from "../processMetadata";

import { FaUpload } from "react-icons/fa";
import { Spreadsheet } from "./Spreadsheet";

export default function CsvUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [table, setTable] = useState<TableData>(null);

  // This 'useEffect' setup prevents the cleanup bug
  useEffect(() => {
    const setMetadata = async () => {
      // Safety return
      if (file === null) return;

      // Get Metadata
      let new_table = await generateTableData(file)
      console.log(new_table)
      setTable(new_table);
    };

    setMetadata();
  
    return () => {
      // this now gets called when the component unmounts
    };
  }, [file]);

  return (
    <>
      <div className="flex-row items-center align-middle p-6 rounded-xl m-4 w-full max-w-md">
        <div className="inline-block">
          <label
            htmlFor="file-upload"
            className="h-fit cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-gray-700 custom-file-upload"
          >
            <FaUpload className="text-blue-500" />
            {file ? "Change File" : "Upload CSV"}
          </label>

          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        <div className="inline-block text-gray-500 p-9">
          {file?.name}
        </div>
      </div>
      <Spreadsheet data={table} />
    </>
  );

  // return (
  //   <div>
  //     <div className="mb-6">
  //         <div className="flex items-start gap-4">
  //           <div className="w-24 font-medium">Upload CSV:</div>
  //           <div className="flex-1">
  //             <div className="flex items-center gap-4">
  //             <label htmlFor="file-upload"
  //                    className="h-fit cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-gray-700 custom-file-upload">
  //               <FaUpload className="text-blue-500" />
  //               {file ? "Change File" : "Upload CSV"}
  //               <input id="file-upload" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
  //             </label>
  //               <span className="text-gray-600">
  //                 {file?.name}
  //               </span>
  //             </div>
  //           </div>
  //         </div>
  //     </div>

  //     <div className="flex justify-between mb-6">
  //         <div className="relative w-[400px]">
  //           {/*Search Bar Logic Comes Here*/}
  //         </div>
  //         <div className="flex gap-3">
  //           <button type="button" className="px-4 py-2 border border-gray-200 rounded-md text-gray-700 bg-white hover:bg-gray-50">
  //             Edit Mode
  //           </button>
  //           <button type="button" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
  //             Export CSV
  //           </button>
  //         </div>
  //     </div>

  //     <div>
  //       <Spreadsheet data={table} />
  //     </div>
  //   </div>
  // )
}


//<div className="w-1 h-1 overflow-x-scroll overflow-y-scroll">
//</div>
