'use client';

import React from 'react';

export const onOutsideClick = (ref, handlerFn) => {
    React.useEffect(() => {
        // add event listener to document to detect clicks outside of navbar
        const handleOutsideClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handlerFn();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [ref]);
};
