// ✅ TableBody.jsx
const TableBody = ({ table }) => (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="hover:bg-testingColorHover">
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="px-4 py-2 border text-sm text-testingColorSubtitle"
            >
              {cell.renderCell ? cell.renderCell() : cell.getValue()}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
  
  export default TableBody; // ✅ THIS LINE is mandatory for default import
  