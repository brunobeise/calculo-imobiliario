import { numeroParaReal } from "@/lib/formatter";
import { Sheet, Table } from "@mui/joy";
import { useMemo } from "react";

interface TableRentAppreciationProps {
  annualCollection?: boolean;
  title?: boolean;
  colspan?: number;
  text: "left" | "right" | "center";
  border?: boolean;
  maxHeight?: number;
  data: number[];
}

export default function TableRentAppreciation(
  props: TableRentAppreciationProps
) {
  const rows = useMemo(() => {
    let actualRentValue = props.data[0] || 0;
    return props.data.reduce(
      (acc, item, i) => {
        if (i === 0 || item !== actualRentValue) {
          acc.push({
            ano: i === 0 ? 1 : i / 12 + 1,
            rentValue: numeroParaReal(item),
            arrecadacaoAnual: numeroParaReal(item * 12),
          });
          actualRentValue = item;
        }
        return acc;
      },
      [] as {
        rentValue: string;
        arrecadacaoAnual: string;
        ano: number;
      }[]
    );
  }, [props.data]);

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
            Valorização do Aluguel
          </h2>
          <p className="text-xs mb-3 text-center">(inflação 8% ao ano)</p>
        </div>
      )}

      <Sheet
        sx={{ height: 380, overflow: "auto", backgroundColor: "transparent" }}
      >
        <Table stickyHeader={true} className={`w-full text-${props.text}`}>
          <thead>
            <tr>
              <th className="w-24">Ano</th>
              <th>Valor do Aluguel</th>
              {props.annualCollection && <th>Arrecadação Anual</th>}
            </tr>
          </thead>

          <tbody>
            {rows?.map((item) => (
              <tr key={item.ano}>
                <td>{item.ano}</td>
                <td>{item.rentValue}</td>
                {props.annualCollection && <td>{item.arrecadacaoAnual}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Sheet>
  );
}
