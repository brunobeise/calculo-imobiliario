import UserPicture from "@/components/shared/UserPicture";
import { Skeleton } from "@mui/joy";

interface DashboardRankProps {
  title: string;
  data: { title: string; photo: string; value: number }[];
  loading: boolean;
}

export default function DashboardRank(props: DashboardRankProps) {
  return (
    <div className="pe-3">
      <p className="tetx-primary text-grayText mb-4">{props.title}</p>
      <div className="grid grid-flow-rows gap-7">
        {!props.loading ? (
          props.data?.map((item, i) => (
            <div
              key={item.title}
              className="flex justify-between gap-2 shadow rounded py-6 items-center p-3 relative bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-primary relative"
            >
              <div className="col-span-6 flex items-center gap-3">
                <UserPicture size={30} src={item.photo} />
                <div className="text-lg font-bold">{item.title}</div>
              </div>
              <div className="col-span-6">
                <div className="absolute rounded-full px-2 outline outline-primary top-[-10px] right-[-10px] bg-white text-primary font-bold">
                  {i + 1}
                </div>

                <div>
                  <p className="text-sm">
                    <span className="font-bold">{item.value} propostas</span>
                  </p>
                  <p className="text-xs text-grayText">nos últimos 90 dias</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex justify-between gap-2 shadow rounded py-6 items-center p-3 relative bg-gradient-to-r from-whitefull to-white border border-grayScale-200">
              <div className="col-span-6 flex items-center gap-3">
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="text" width={120} height={24} />
              </div>
              <div className="col-span-6 flex flex-col items-end gap-2">
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={80} height={16} />
              </div>
            </div>

            <div className="flex justify-between gap-2 shadow rounded py-6 items-center p-3 relative bg-gradient-to-r from-whitefull to-white border border-grayScale-200">
              <div className="col-span-6 flex items-center gap-3">
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="text" width={120} height={24} />
              </div>
              <div className="col-span-6 flex flex-col items-end gap-2">
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={80} height={16} />
              </div>
            </div>

            <div className="flex justify-between gap-2 shadow rounded py-6 items-center p-3 relative bg-gradient-to-r from-whitefull to-white border border-grayScale-200">
              <div className="col-span-6 flex items-center gap-3">
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="text" width={120} height={24} />
              </div>
              <div className="col-span-6 flex flex-col items-end gap-2">
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={80} height={16} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
