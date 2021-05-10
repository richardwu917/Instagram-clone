import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';

export default function UserAuthListener() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if(authUser) {
                localStorage.setItem('authUser', JSON.stringify(authUser));
                setUser(authUser);
            } else {
                localStorage.removeItem('authUser');
                setUser(null);
            }
        })

        return () => unsubscribe();
    }, []);

    return { user };
}