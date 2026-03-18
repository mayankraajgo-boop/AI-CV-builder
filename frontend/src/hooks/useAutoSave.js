import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateResume } from '../store/resumeSlice';

const useAutoSave = (resumeId, data, delay = 2000) => {
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!resumeId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      dispatch(updateResume({ id: resumeId, data }));
    }, delay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [data, resumeId, delay, dispatch]);
};

export default useAutoSave;
