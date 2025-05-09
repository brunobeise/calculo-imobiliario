import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { FormLabel, Input } from "@mui/joy";
import { FaRegCalendar } from "react-icons/fa6";

interface DatePickerProps {
  onChange: (date: string) => void;
  id?: string;
  label?: string;
  defaultValue?: string;
  noHeight?: boolean;
  width?: string;
  disabled?: boolean;
  opacity?: boolean;
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DatePicker: React.FC<DatePickerProps> = ({
  onChange,
  id,
  label,
  defaultValue,
  noHeight,
  width = "100%",
  disabled = false,
  opacity = false,
}) => {
  const initialMonth = defaultValue
    ? dayjs(defaultValue, "MM/YYYY").month()
    : dayjs().month();
  const initialYear = defaultValue
    ? dayjs(defaultValue, "MM/YYYY").year()
    : dayjs().year();

  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(
    defaultValue ? defaultValue : dayjs().format("MM/YYYY")
  );

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
      setSelectedMonth(dayjs(defaultValue, "MM/YYYY").month());
      setSelectedYear(dayjs(defaultValue, "MM/YYYY").year());
    }
  }, [defaultValue]);

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    triggerOnChange(month, selectedYear);
    setShowModal(false);
  };

  const handleYearChange = (offset: number) => {
    const year = selectedYear + offset;
    setSelectedYear(year);
    triggerOnChange(selectedMonth, year);
  };

  const triggerOnChange = (month: number, year: number) => {
    const formattedDate = dayjs().month(month).year(year).format("MM/YYYY");
    setInputValue(formattedDate);
    onChange(formattedDate);
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className={`relative ${opacity ? "opacity-50" : ""}`}>
      <div className={`flex ${noHeight ? "" : "h-[40px]"} items-center`}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          disabled={disabled}
          style={{ width: width }}
          type="text"
          value={inputValue}
          readOnly
          endDecorator={
            <div onClick={toggleModal} className="cursor-pointer text-grayText">
              <FaRegCalendar />
            </div>
          }
        />
      </div>

      {showModal && (
        <div
          ref={modalRef}
          className="absolute top-[0rem] translate-x-[50%] right-[50%] mt-2 bg-white shadow-lg border border-gray p-4 rounded-lg w-64 z-[100] transition-opacity ease-in-out duration-300 opacity-100 transform scale-100"
        >
          <div className="flex justify-between items-center mb-4">
            <div
              onClick={() => handleYearChange(-1)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
            >
              {"<"}
            </div>
            <span className="text-lg font-bold">{selectedYear}</span>
            <div
              onClick={() => handleYearChange(1)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
            >
              {">"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <div
                key={index}
                onClick={() => handleMonthChange(index)}
                className={`p-2 text-center rounded-md cursor-pointer text-sm flex justify-center ${
                  index === selectedMonth
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                {month}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
