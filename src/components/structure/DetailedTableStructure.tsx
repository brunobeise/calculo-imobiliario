/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { toBRL } from "@/lib/formatter";
import { Tooltip } from "@mui/joy";

interface ColumnDefinition {
  title: string;
  dataIndex: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface DetailedTableComponentProps {
  columns: ColumnDefinition[];
  rows: any[];
  rowKey: (record: any, index: number) => string | number;
}

const DetailedTableComponent: React.FC<DetailedTableComponentProps> = ({
  columns,
  rows,
  rowKey,
}) => {
  const theme = useTheme();
  const matchesLG = useMediaQuery(theme.breakpoints.up("lg"));

  const filteredColumns = useMemo(() => {
    return columns.filter((column) => {
      return rows.some((row) => row[column.dataIndex] !== 0);
    });
  }, [columns, rows]);

  return (
    <div className="col-span-12 lg:px-2 bg-whitefull">
      <h2 className="text-xl text-center font-bold my-2">Tabela Detalhada</h2>
      <Sheet
        sx={{
          height: 720,
          backgroundColor: "transparent",
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: 600 }}>
          <Table
            className="text-left"
            borderAxis="x"
            color="neutral"
            size={matchesLG ? "md" : "sm"}
            stickyFooter={true}
            stickyHeader={true}
            variant="outlined"
          >
            <thead>
              <tr>
                {filteredColumns.map((col, index) => (
                  <th
                    key={index}
                    style={index === 0 ? { width: "100px" } : undefined}
                  >
                    <Tooltip title={col.title} arrow>
                      <span>{col.title}</span>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  className="hover:bg-[#f6f6f6]" 
                >
                  {filteredColumns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render
                        ? col.render(row[col.dataIndex], row, index)
                        : toBRL(row[col.dataIndex])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Sheet>
    </div>
  );
};

export default DetailedTableComponent;
