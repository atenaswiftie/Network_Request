import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useApi } from './useApi';
import { ERROR, PENDING, SUCCESS } from './constants/apiStatus';


interface IData {
  message: string;
}

interface IError {
  error: string;
}

// Helper Component to use the hook
function ApiWrapper({ url }: { url: string }) {
    const { data , status, error, exec, refetch } = useApi(url, { triggerOnMount: true });
  
    return (
      <div>
        {status === PENDING && <p>Loading...</p>}
        {status === SUCCESS && <p>{(data as IData).message}</p>}
        {status === ERROR && <p>Error: {(error as IError).toString()}</p>}
        <button onClick={() => refetch()}>Refetch</button>
        <button onClick={() => exec()}>Execute</button>
      </div>
    );
  }

describe('useApi hook integration tests', () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';
  const mock = new MockAdapter(axios);

  afterEach(() => {
    mock.reset();
  });

  it('should display data on success', async () => {
    const mockData = { message: 'Success!' };
    mock.onGet(url).reply(200, mockData);
  
    render(<ApiWrapper url={url} />);
    fireEvent.click(screen.getByText('Execute'));
  
    await waitFor(() => expect(screen.getByText('Success!')).toBeInTheDocument());
  });

  it('should display error message on failure', async () => {
    mock.onGet(url).networkError();

    render(<ApiWrapper url={url} />);
    fireEvent.click(screen.getByText('Execute'));

    await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());

  });

});
