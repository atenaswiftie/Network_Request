import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { useApi } from './hook/useApi';

// Define the types for the data expected from the API
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}


const MyComponent: React.FC = () => {
  const [userId, setUserId] = useState<string>('');


  // useApi hook initialization
  const { data, exec,refetch, isPending, isError, isSuccess } = useApi<Todo[], AxiosError>(`https://jsonplaceholder.typicode.com/todos/:userId`, 
    {
      method: 'GET',
      params: { userId: '123' }, 
      headers: {
        'Content-Type': 'application/json'
      },
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.log('Error:', error),
    }
  );


  // Function to handle form submission and execute the API call
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    exec( {
      pathParams: { userId: '3' }, 
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.log('Error:', error),
    }); 
    exec( {
      pathParams: { userId: '3' }, 
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.log('Error:', error),
    }); 
    refetch()
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
        </label>
        <button style={{backgroundColor:"lightcyan"}} type="submit" disabled={!userId}>Fetch Data</button>
      </form>
      {isPending && <p>Loading...</p>}
      {isError && <p>Error occurred while fetching data.</p>}
      {isSuccess && data && (
        <div>
          <h3>Data Retrieved:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
