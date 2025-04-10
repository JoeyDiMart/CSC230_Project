"use client"
import React, { useEffect, useMemo, useState } from "react"
import {useReactTable,getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender,} from "@tanstack/react-table"
import { FaRegCircleCheck } from "react-icons/fa6";
import { PiSpinnerBold } from "react-icons/pi";


{/*API Simulation for backend call */}
import { fetchUsers } from "./api"


export default function DataTable() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchUsers()
    .then(setData)
    .catch(
      (err) => {
        console.log("Error loading users:", err)
      });
  }, []);

  const columns = useMemo(() => [
    {
        accessorKey: "title",
        header : () => <span className="font-semibold">Publication Title</span>
    },
    {
      accessorKey: "name",
      header: () => <span className="font-semibold">Name</span>,
    },
    {
      accessorKey: "email",
      header: () => <span className="font-semibold">Email</span>,
    },
    {
        accessorKey: "status",
        header: () => <span className="font-semibold">Status</span>,
        cell: ({getValue}) => {
            const status = getValue()
            const isDone = status === "Done"
            const isLoading = status === "In Process"
            return (
                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-bold border border-testingColorGrey text-testingColorSubtitle min-w-[100px]
                    ${isDone ? "bg-none border-solid border-1 border-testingColorGrey text-testingColorSubtitle " : isLoading ? "bg-none border-solid border-1 border-testingColorGrey text-testingColorSubtitle" : "bg-none border-solid border-1 border-testingColorGrey text-testingColorSubtitle"}`}>
                    {isDone && <FaRegCircleCheck className="text-green-500 " />}
                    {isLoading && <PiSpinnerBold className=" text-yellow-300 " />}
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </div>
            )

        }
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="bg-none rounded-xl shadow p-4 relative border-7 border-solid border-2 border-testingColorGrey">
      <h2 className="text-xl font-semibold mb-4 text-testingColorSubtitle">Recent Publications</h2>
      <div className="overflow-hidden rounded-t-lg">
        <table className="min-w-full table-auto  border-gray-300 border-spacing-0">
          <thead className="bg-testingColorOutline">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 border text-center text-sm font-medium text-testingColorSubtitle  ">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-testingColorHover">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 border text-sm text-testingColorSubtitle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} 
          className=" text-black px-3 py-1 w-20 border rounded bg-gray-100 text-sm disabled:opacity-50">
            Previous
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} 
          className=" text-black px-3 py-1 border  w-20 rounded bg-gray-100 text-sm disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
