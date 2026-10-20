import React from "react";
import Icon from "@/components/ui/Icon";
// Old version is deprecated, never use that
// import {
//   useTable,
//   useRowSelect,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomTable from "./CustomTable";

const ListComponent = ({
  data,
  columns,
  total = 1,
  loading,
  footer = true,
  perPage = 10,
  page = 1,
  onPageChange,
}) => {
  // State
  console.log("ListComponentdata", data)
  let serverSide = false;
  if (onPageChange) {
    //Decide Between Client side pagination or server side pagination
    serverSide = true;
  }

  const onPaginationChange = (val) => {
    const params = val({ pageIndex: page - 1 }); // get pageIndex and pageSize
    const obj = {};
    if (typeof params?.pageIndex !== "undefined") {
      obj.page = params.pageIndex + 1;
    }
    if (typeof params?.pageSize !== "undefined") {
      obj.limit = params.pageSize;
    }
    onPageChange(obj);
  };

  const tableInstance = useReactTable({
    columns,
    data,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: total,
      },
    },
    pageCount: Math.ceil(total / perPage),
    onPaginationChange: onPaginationChange,
    manualPagination: serverSide,
    manualSortBy: serverSide,
    getCoreRowModel: getCoreRowModel(),
    manualFilters: serverSide,
    manualGlobalFilter: serverSide,
  });

  const {
    getTableProps,
    getTableBodyProps,
    getPageCount,
    setPageIndex,
    getHeaderGroups,
    getRowModel,
    getState,
    nextPage,
    previousPage,
    getCanPreviousPage,
    getCanNextPage,
  } = tableInstance;

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5; // Adjust the number of visible pages as needed

    for (let i = 0; i < getPageCount(); i++) {
      if (
        i === 0 ||
        i === getPageCount() - 1 ||
        Math.abs(i - getState().pagination.pageIndex) < maxVisiblePages / 2
      ) {
        buttons.push(
          <li key={i}>
            <button
              className={` ${i === getState().pagination.pageIndex
                ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                : "bg-slate-100  dark:text-slate-400 text-slate-900  font-normal "
                }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
              onClick={() => setPageIndex(i)}
              disabled={getState().pagination.pageIndex === i}
            >
              {i + 1}
            </button>
          </li>
        );
      } else if (buttons[buttons.length - 1] !== "...") {
        buttons.push("...");
      }
    }

    return buttons;
  };

  return (
    <>
      {loading ? (
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <CustomTable
                rowHeight="74px"
                rows={perPage}
                columns={Object.keys(columns).length}
              />
            </div>
          </div>
        </div>
      ) : data.length >= 1 ? (
        <>
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table
                  className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                  {...getTableProps}
                >
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    {getHeaderGroups().map((headerGroup, index) => (
                      <tr key={index}>
                        {headerGroup.headers.map((header, thindex) => (
                          <th
                            key={thindex}
                            colSpan={header.colSpan}
                            scope="col"
                            className=" table-th "
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <span>
                              {header.isSorted
                                ? header.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                    {...getTableBodyProps}
                  >
                    {getRowModel().rows.map((row, pindex) => {
                      return (
                        <tr key={pindex}>
                          {row.getVisibleCells().map((cell, cindex) => {
                            return (
                              <td key={cindex} className="table-td">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {footer && (
            <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
              <div className=" flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Showing{" "}
                  <span>
                    {getState().pagination.pageIndex * perPage + 1} to{" "}
                    {Math.min(
                      total,
                      (getState().pagination.pageIndex + 1) * perPage
                    )}{" "}
                    of {total} entries
                  </span>
                </span>
              </div>
              <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
                <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                  <button
                    className={` ${!getCanPreviousPage()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                    onClick={() => previousPage()}
                    disabled={!getCanPreviousPage()}
                  >
                    <Icon icon="heroicons:chevron-double-left-solid" />
                  </button>
                </li>
                <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                  <button
                    className={` ${!getCanPreviousPage()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                    onClick={() => previousPage()}
                    disabled={!getCanPreviousPage()}
                  >
                    Prev
                  </button>
                </li>
                {renderPageButtons()}
                <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                  <button
                    className={` ${!getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    onClick={() => nextPage()}
                    disabled={!getCanNextPage()}
                  >
                    Next
                  </button>
                </li>
                <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                  <button
                    onClick={() => nextPage()}
                    disabled={!getCanNextPage()}
                    className={` ${!getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    <Icon icon="heroicons:chevron-double-right-solid" />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-red-600">No Data Found</p>
        </div>
      )}
    </>
  );
};

export default ListComponent;
