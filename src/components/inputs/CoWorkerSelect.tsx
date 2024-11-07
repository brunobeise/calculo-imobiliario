import { useDispatch, useSelector } from "react-redux";
import UserSelect from "./UserSelect";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchRealEstateUsers } from "@/store/realEstateReducer";

interface CoWorkerSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function CoWorkerSelect(props: CoWorkerSelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { realEstateData, loading } = useSelector(
    (state: RootState) => state.realEstate
  );
  useEffect(() => {
    if (!realEstateData) {
      dispatch(fetchRealEstateUsers());
    }
  }, [dispatch, realEstateData]);

  return (
    <UserSelect
      loading={loading}
      users={realEstateData?.users || []}
      value={props.value}
      onChange={props.onChange}
      label={props.label}
    />
  );
}
