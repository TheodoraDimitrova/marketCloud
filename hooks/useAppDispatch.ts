import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);