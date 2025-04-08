import { flexRender } from "@tanstack/react-table";

const TableHeader = ({ table }) => (
  <thead className="bg-testingColorOutline">
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            className="px-4 py-2 border text-center text-sm font-medium text-testingColorSubtitle"
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
);

export default TableHeader; // ✅ This makes the default import work
