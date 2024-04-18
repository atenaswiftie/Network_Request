# UseApi with React + TypeScript + Vite
The `useApi` hook implemented is a robust tool for handling API requests in a React component. Here's a detailed explanation of each parameter used in this hook:
### Parameters of `useApi`

1. **`initialUrl`**:
   - **Type**: `string`
   - **Purpose**: This is the base URL for the API request. It is the endpoint to which the HTTP request is sent. It can be a complete URL or a part that will be dynamically completed using `pathParams`.

2. **`config`**:
   - **Type**: `UseApiConfig<TData, TError>`
   - **Purpose**: This configuration object specifies various options and handlers related to the API request. It extends the standard `AxiosRequestConfig` to include additional custom properties and callbacks.

### Sub-parameters of `UseApiConfig<TData, TError>`

1. **`initialData`**:
   - **Type**: `TData`
   - **Purpose**: Optional initial value for the data state before the API call is made. This is useful for initializing state to a default value while waiting for the request to complete.

2. **`onSuccess`**:
   - **Type**: `(data: TData) => void`
   - **Purpose**: A callback function that is executed when the API request completes successfully. It receives the response data as a parameter.

3. **`onError`**:
   - **Type**: `(error: AxiosError<TError>) => void`
   - **Purpose**: A callback function that is called if the API request fails. It receives the error object, allowing for error handling like logging errors or displaying error messages to the user.

4. **`onFinally`**:
   - **Type**: `(data?: TData, error?: AxiosError<TError>) => void`
   - **Purpose**: A callback function that is executed after the request is completed, regardless of success or failure. Useful for cleanup actions or final state updates.

5. **`onCancel`**:
   - **Type**: `() => void`
   - **Purpose**: This function is called when an API request is canceled, typically used to handle UI updates when a request is aborted.

6. **`triggerOnMount`**:
   - **Type**: `boolean`
   - **Purpose**: If true, the API request will be triggered immediately when the component mounts. This is often used to load data as soon as a component is rendered.

7. **`pathParams`**:
   - **Type**: `Record<string, string | number>`
   - **Purpose**: An object that contains parameters to be dynamically inserted into the URL, useful for endpoints where path segments are variable (e.g., `/api/user/:userId`).

8. **`debounceDelay`**:
   - **Type**: `number`
   - **Purpose**: The delay in milliseconds for debouncing the API request. This prevents the API from being called too frequently, which is particularly useful for handling rapid user input such as search field typing.

### Internal States and Methods

- **`data`**: Stores the response data from the API. It's initialized with `initialData` and updated upon successful API calls.
- **`error`**: Holds any error information if the API call fails.
- **`status`**: Reflects the current status of the API request, such as pending, success, or error.
- **`exec`**: The function used to execute the API call. It can be configured to be debounced and can accept override configurations for dynamic usage.
- **`refetch`**: A method that uses the last configuration used in `exec` to re-execute the API call, typically used for refreshing data.

This structure ensures that the `useApi` hook is flexible and robust, providing comprehensive capabilities to handle different aspects of making API requests within a React application.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### Run Project
git clone https://github.com/atenaswiftie/Network_Request.git

cd Network_Request

npm install

npm run dev

