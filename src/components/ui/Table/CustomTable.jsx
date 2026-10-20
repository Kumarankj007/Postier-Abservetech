import React from "react";

const CustomTable = ({ rows, columns, rowHeight = '74px' }) => {
  const rowItems = Array.from({ length: rows });
  const colItems = Array.from({ length: columns });
  console.log("rowss", rowItems)
  console.log("colss", colItems)
  return (
    <table className="animate-pulse min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
      <thead>
        <tr>
          {colItems.map((col, j) => (<th scope="col" className="table-th" key={j}>
            <div className="h-4 bg-[#C4C4C4] dark:bg-slate-500"></div>
          </th>))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
        {rowItems.map((item, i) => (
          <tr key={i}>
            {colItems.map((col, j) => (<td key={j} className="table-td" style={{
              height: rowHeight
            }}>
              <div className="h-2 bg-[#C4C4C4] dark:bg-slate-500"></div>
            </td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomTable;
