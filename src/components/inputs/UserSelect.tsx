import { User } from "@/types/userTypes";
import { FormLabel, Option, Select, Sheet } from "@mui/joy";
import { Spinner } from "../Loading";

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  users: User[];
  loading?: boolean;
  label?: string;
}

export default function UserSelect(props: UserSelectProps) {
  return (
    <div>
      <FormLabel htmlFor={"user__select"}>{props.label}</FormLabel>
      <Select
        id="user__select"
        onChange={(_, v) => props.onChange(v as string)}
      >
        <Option value={""}>
          <Sheet className="w-full p-2 flex flex-col justify-center cursor-pointer hover:shadow-md">
            <div className="flex items-center">
              <div className="ms-2 flex flex-col">
                <span className="text-md text-blackish">Todos</span>
              </div>
            </div>
          </Sheet>
        </Option>
        {!props.loading ? (
          <>
            {props.users.map((user) => (
              <Option value={user.id}>
                <Sheet className="w-full p-2 flex flex-col justify-center cursor-pointer hover:shadow-md">
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
                </Sheet>
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
