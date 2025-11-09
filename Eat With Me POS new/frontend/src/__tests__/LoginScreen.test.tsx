import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginScreen } from '../components/LoginScreen';
import { AuthProvider } from '../contexts/AuthContext';
import api from '../lib/api';

// Mock the api module
jest.mock('../lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('LoginScreen', () => {
  it('renders the login form', () => {
    render(
      <AuthProvider>
        <LoginScreen onLogin={() => {}} />
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText('Enter your restaurant ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Sign In with AI')).toBeInTheDocument();
  });

  it('allows a user to log in successfully', async () => {
    const onLogin = jest.fn();
    mockedApi.post.mockResolvedValue({ data: { token: 'fake-token' } });

    render(
      <AuthProvider>
        <LoginScreen onLogin={onLogin} />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your restaurant ID'), { target: { value: 'res123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In with AI'));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      }, {
        headers: { 'X-Restaurant-Id': 'res123' },
      });
      expect(onLogin).toHaveBeenCalled();
    });
  });

  it('shows an error message on failed login', async () => {
    mockedApi.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

    render(
      <AuthProvider>
        <LoginScreen onLogin={() => {}} />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your restaurant ID'), { target: { value: 'res123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Sign In with AI'));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});
