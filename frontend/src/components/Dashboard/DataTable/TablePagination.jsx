const TablePagination = ({ table }) => (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-black px-3 py-1 border rounded bg-gray-100 text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-black px-3 py-1 border rounded bg-gray-100 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
  
  export default TablePagination; // ✅ Required for default import
  