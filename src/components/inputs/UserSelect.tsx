import { User, UserSelectOption } from "@/types/userTypes";
import { FormLabel, Option, Select } from "@mui/joy";
import { Spinner } from "../Loading";

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  users: User[] | UserSelectOption[];
  loading?: boolean;
  label?: string;
  placeholder?: string;
}

export default function UserSelect(props: UserSelectProps) {
  return (
    <div className="w-[250px]">
      <FormLabel htmlFor={"user__select"}>{props.label}</FormLabel>
      <Select
        placeholder={props.placeholder}
        id="user__select"
        onChange={(_, v) => props.onChange(v as string)}
      >
        <Option className="!bg-whitefull hover:!bg-grayScale-100" value={""}>
          <div className="w-full p-2 flex flex-col justify-center cursor-pointer bg-transparent">
            <div className="flex items-center">
              <div className="ms-2 flex flex-col">
                <span className="text-md text-blackish">Todos</span>
              </div>
            </div>
          </div>
        </Option>
        {!props.loading ? (
          <>
            {props.users.map((user) => (
              <Option
                className="!bg-whitefull hover:!bg-grayScale-100"
                key={user.id}
                value={user.id}
              >
                <div className="w-full p-2 flex flex-col justify-center cursor-pointer bg-transparent">
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden flex justify-center items-center w-[30px] h-[30px]">
                      <img
                        src={
                          user?.photo ||
                          "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
                        }
                      />
                    </div>
                    <div className="ms-2 flex flex-col">
                      <span className="text-md text-blackish">
                        {user?.fullName}
                      </span>
                    </div>
                  </div>
                </div>
              </Option>
            ))}
          </>
        ) : (
          <Spinner />
        )}
      </Select>
    </div>
  );
}
