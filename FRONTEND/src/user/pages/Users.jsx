import React,{useEffect,useState} from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users=()=>{
 const {isLoading,error,sendRequest,clearError}= useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                console.log('🔄 Fetching users from API...');
                const responseData = await sendRequest(import.meta.env.VITE_BACKEND_URL + '/users?t=' + Date.now());
                console.log('✅ Users API response:', responseData);
                
                if (responseData && responseData.users) {
                    setLoadedUsers(responseData.users);
                    console.log(`📊 Loaded ${responseData.users.length} users`);
                } else {
                    console.warn('⚠️ Invalid response format:', responseData);
                    setLoadedUsers([]);
                }
            } catch (err) {
                console.error('❌ Failed to fetch users:', err);
                setLoadedUsers([]);
            }
        };
        fetchUsers();
    }, [sendRequest]);

    
    return(
    <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && (
            <div className="center">
                <LoadingSpinner asOverlay/>
            </div>
        )}

        {!isLoading && loadedUsers && loadedUsers.length > 0 && (
            <UsersList items={loadedUsers}/>
        )}
        
        {!isLoading && loadedUsers && loadedUsers.length === 0 && (
            <div className="center">
                <h2>No users found.</h2>
            </div>
        )}
    </React.Fragment>
    );
};

export default Users;