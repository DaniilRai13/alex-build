import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const useIsActiveLink = () => {
	const location = useLocation(); 
    
    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );
	return { isActive };
};

export default useIsActiveLink;
