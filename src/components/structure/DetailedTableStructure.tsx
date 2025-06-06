/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect } from "react";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { toBRL } from "@/lib/formatter";
import { Tooltip, Skeleton } from "@mui/joy";

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

  const [showTable, setShowTable] = useState(false);

  // Exibe skeleton por 1 segundo para evitar lag da renderização
  useEffect(() => {
    setShowTable(false);
    const timeout = setTimeout(() => {
      setShowTable(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [rows]);

  const filteredColumns = useMemo(() => {
    return columns.filter((column) => {
      return rows.some((row) => row[column.dataIndex] !== 0);
    });
  }, [columns, rows]);

  if (!showTable) {
    // Skeleton completo simulando a tabela
    return (
      <div className="col-span-12 lg:px-2 bg-whitefull">
        <h2 className="text-xl text-center font-bold my-2">Tabela Detalhada</h2>
        <Sheet
          sx={{
            height: 720,
            backgroundColor: "transparent",
            overflowX: "auto",
            padding: 2,
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height={700}
            sx={{ borderRadius: 1 }}
          />
        </Sheet>
      </div>
    );
  }

  // Renderiza tabela real após 1s
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
                <tr key={rowKey(row, index)} className="hover:bg-[#f6f6f6]">
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
