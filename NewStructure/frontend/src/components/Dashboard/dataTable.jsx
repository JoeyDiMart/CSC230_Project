"use client"
import React, { useEffect, useMemo, useState } from "react"
import {useReactTable,getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender,} from "@tanstack/react-table"
import { FaRegCircleCheck } from "react-icons/fa6";
import { PiSpinnerBold } from "react-icons/pi";
import { ImCross } from "react-icons/im";


{/*API Simulation for backend call */}
import { fetchUsers } from "./api"


// // SAMPLE API
// const fetchUsers = () => {
//   return Promise.resolve([
//     {
//       _id: "1",
//       title: "AI and Ethics in Society",
//       author: "Jane Doe",
//       email: "jane@example.com",
//       status: "under review"
//     },
//     {
//       _id: "2",
//       title: "Quantum Computing Advances",
//       author: "John Smith",
//       email: "john@example.com",
//       status: "accepted"
//     },
//     {
//       _id: "3",
//       title: "Climate Change Models",
//       author: "Alice Johnson",
//       email: "alice@example.com",
//       status: "denied"
//     }
//   ]);
// };


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


  // Refresh DataTable For Accept/Deny Buttons
  const refreshData = async () => {
    try {
      const users = await fetchUsers();
      setData(users);
    } catch(err) {
      console.log("Error Refreshing Data", err)
    }
  };

  const columns = useMemo(() => [
    {
        accessorKey: "title",
        header : () => <span className="font-semibold">Publication Title</span>
    },
    {
      accessorKey: "author",
      header: () => <span className="font-semibold">Author</span>,
    },
    {
      accessorKey: "email",
      header: () => <span className="font-semibold">Email</span>,
    },
    {
      accessorKey: "status",
      header: () => <span className="font-semibold">Status</span>,
      cell: ({ getValue, row }) => {
        const status = getValue();
        const id = row.original._id;

        return <StatusButton status={status} id={id} refreshData={refreshData} />
      },
    },
  ], [])

  function StatusButton ({ status, id}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = React.useRef(null)


    // Click Outside Event Listener for Accept/Deny Button
    useEffect (() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false); 
        }
      };
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
  },[]);


    const handleUpdateStatus = async (newStatus) => {
      try {
        const response = await fetch(`http://localhost:8081/publications/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: newStatus, id }),
    });

    if (!response.ok) throw new Error("Failed to update status");

    setOpen(false);
    await refreshData();
   } catch (err) {
     console.log("Error updating status:", err);
     alert("Failed to update status", err);
     }
    };

    const isDone = status === "accepted";
    const isLoading = status === "under review";
    const isDenied = status === "denied"

    const formatStatus =(s) =>  
      s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown";

    return (
      <div ref={dropdownRef} className="relative inline-flex">
        <button onClick={() => setOpen(!open)} className={` bg-transparent inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-bold border border-testingColorGrey text-testingColorSubtitle min-w-[100px]
          ${isDone ? "text-green-500" : isDenied ? "text-red-500" : "text-testingColorSubtitle"}`}>
          {isDone && <FaRegCircleCheck className="text-green-500" />}
          {isLoading && <PiSpinnerBold className="text-yellow-300 animate-spin" />}
          {isDenied && <ImCross className="text-red-500" />}
          <span>{formatStatus(status)}</span>
        </button>
        {open && (
          <div className=" flex bg-transparent z-2 text-xs">
            <button onClick={() => {handleUpdateStatus("accepted")
            }} className=" bg-transparent w-full text-left px-4 py-2 hover:bg-green-500 transition-colors duration-300 ease-in-out ">
              Accept
            </button>
            <button onClick={() => {handleUpdateStatus("denied") }} className=" bg-transparent w-full text-left px-4 py-2 hover:bg-red-500 transition-colors duration-300 ease-in-out">
              Deny
            </button>
          </div>
        )}
      </div>
    );

  }

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
