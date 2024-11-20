import { useDispatch, useSelector } from "react-redux";
import UserSelect from "./UserSelect";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchRealEstateUsers } from "@/store/realEstateReducer";

interface CoWorkerSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function CoWorkerSelect(props: CoWorkerSelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { realEstateUsers, loading } = useSelector(
    (state: RootState) => state.realEstate
  );
  useEffect(() => {
    if (!realEstateUsers) {
      dispatch(fetchRealEstateUsers());
    }
  }, [dispatch, realEstateUsers]);

  return (
    <UserSelect
      loading={loading}
      users={realEstateUsers || []}
      value={props.value}
      onChange={props.onChange}
      label={props.label}
      placeholder={props.placeholder}
    />
  );
}
