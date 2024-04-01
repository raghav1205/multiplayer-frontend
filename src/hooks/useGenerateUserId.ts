import { useState } from "react";

export const useGenerateUserDetails =  () => {
  
    //     });
    const [userDetails] = useState(() => {
        if (typeof window === 'undefined') return { username: '', userId: '' };
     
        const storedName = localStorage.getItem('username');
        const storedId = localStorage.getItem('userId');

        if (storedName && storedId) {
            saveUser(storedName, storedId);
            return { username: storedName, userId: storedId };
        }

        else {
            const randomName = Math.random().toString(36).substring(7);
            const randomId = Math.random().toString(36).substring(7);
            localStorage.setItem('username', randomName);
            localStorage.setItem('userId', randomId);
            saveUser(randomName, randomId);
            return { username: randomName, userId: randomId };
        }
    })

    return userDetails;
}


    const saveUser = (
        username: string,
        userId: string
    ) => {
        const user = {
            username: username,
            userId: userId
        };
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });
    };