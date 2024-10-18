import { toBRL } from "@/lib/formatter";
import { Sheet, Table } from "@mui/joy";

import { useMemo } from "react";

interface TablePropertyAppreciationProps {
  annualCollection?: boolean;
  title?: boolean;
  colspan?: number;
  text: "left" | "right" | "center";
  border?: boolean;
  maxHeight?: number;
  data: number[];
  totalValorization?: boolean;
  propertyValue: number;
}

export default function TablePropertyAppreciation(
  props: TablePropertyAppreciationProps
) {
  const rows = useMemo(() => {
    return props.data.reduce(
      (acc, item, i) => {
        if (i > 0 && item !== props.data[i - 1]) {
          acc.push({
            ano: (i + 1) / 12,
            propertyValue: toBRL(item),
            arrecadacaoAnual: `${(
              (item / props.propertyValue) * 100 -
              100
            ).toFixed(2)}%`,
          });
        }
        return acc;
      },
      [] as {
        propertyValue: string;
        arrecadacaoAnual: string;
        ano: number;
      }[]
    );
  }, [props.propertyValue, props.data]);

  return (
    <Sheet
      variant={props.border ? "outlined" : "plain"}
      className={
        `w-full p-2 ${
          props.colspan
            ? ` col-span-${props.colspan} md:col-span-${
                props.colspan / 2
              } lg:col-span-${Math.ceil(props.colspan / 3)} 
           `
            : ""
        }` + ` ${props.border ? `` : ` border-0`}`
      }
    >
      {props.title && (
        <div className="mt-2">
          <h2 className="text-xl text-center font-bold ">
            Valorização do Imóvel
          </h2>
        </div>
      )}
      <Sheet sx={{ height: 380, overflow: "auto" }}>
        <Table stickyHeader={true} className="w-full mt-2 text-left">
          <thead>
            <tr>
              <th className="w-24">Ano</th>
              <th>Valor do Imóvel</th>
              {props.totalValorization && <th>Valorização total</th>}
            </tr>
          </thead>
          <tbody>
            {rows?.map((item) => (
              <tr key={item.ano}>
                <td>{item.ano}</td>
                <td>{item.propertyValue}</td>
                {props.totalValorization && <td>{item.arrecadacaoAnual}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Sheet>
  );
}
