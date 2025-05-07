import { ReactNode } from "react";
import { FaHome } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";

const menuItems = [
  { id: "property", label: "Imóvel", icon: <FaHome className="text-xl" /> },
  { id: "images", label: "Imagens", icon: <FaImage className="text-xl" /> },
  {
    id: "config",
    label: "Config.",
    icon: <FaGear className="text-xl" />,
  },
  {
    id: "notes",
    label: "Notas",
    icon: <MdNoteAlt className="text-2xl" />,
  },
];

interface ReportMenuProps {
  activeItem: string;
  onSelectItem: (v: string) => void;
  children: ReactNode;
}

const ReportMenu = ({
  activeItem,
  onSelectItem,
  children,
}: ReportMenuProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 fixed h-screen pb-24 md:pb-0 w-full md:w-min">
      <div className="flex md:flex-col p-4 gap-6 text-primary bg-transparent sticky top-0 left-0 md:h-[85vh] z-10 md:ms-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center gap-2 cursor-pointer ${
              activeItem === item.id ? "text-primary-color" : "text-gray-400"
            }`}
            onClick={() => onSelectItem(item.id)}
          >
            <button
              className={`w-12 h-12 flex items-center justify-center bg-transparent rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? "bg-white shadow-md"
                  : "hover:bg-grayScale-200"
              }`}
            >
              {item.icon}
            </button>
            <span className="text-xs font-bold">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 md:p-8 w-ful  bg-whitefull md:w-[460px] xxl:w-[520px] uw:w-[520px]  md:sticky top-5 md:mt-5 left-0 md:h-[85vh] z-10 shadow  overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default ReportMenu;
