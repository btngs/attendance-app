const API_URL = 'http://localhost:5000';

export const getAllUsers = async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const result = await response.json();
    return result;
}