import { useState, useEffect } from 'react';

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Toolbar from './components/Toolbar';
import AllUsersPage from './pages/AllUsersPage';
import SingleUserPage from './pages/SingleUserPage';
import Requests from './pages/Requests';
import Upload from './pages/Upload';

import mainContext from './context/mainContext';
import fetchRequest from './fetchRequest';

function App() {
  let [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(socketIOClient('http://localhost:4000'));
  }, []);

  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [state, setState] = useState({
    myItems: [],
    currentUser: {},
    requests: [],
  });
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('message', (message) => {
      const newMessages = messages.filter((msg) => msg._id !== message._id);
      setMessages([...newMessages, message]);
      setRequests([...requests, message]);
    });
  }, [socket]);

  async function getAllUsers() {
    let result = [0];
    await fetchRequest('/all-users')
      .then((res) => res.json())
      .then((res) => {
        result = res;
      });
    return result;
  }

  useEffect(() => {
    fetchRequest('/get-requests')
      .then((res) => res.json())
      .then(async (res) => {
        const { users } = await getAllUsers();
        if (res.success) {
          setState({ ...state, requests: res.data, users });
        } else {
          console.error('Error fetching');
        }
      });
  }, []);

  const filteredMessages = messages.filter(
    (data) =>
      data.owner && data.owner.id === state.currentUser?.userId && !data.alert
  );

  const filteredAlerts = messages.filter(
    (data) =>
      data.requestor &&
      data.requestor.userId === state.currentUser?.userId &&
      data.alert
  );

  useEffect(() => {
    setState({
      ...state,
      requests: requests.filter(
        (data) => data.owner && data.owner.id === state.currentUser?.userId
      ),
    });
  }, [requests]);

  return (
    <div className="App">
      <mainContext.Provider value={{ state, setState }}>
        <BrowserRouter>
          <Toolbar />
          <div className="mb-10">
            {filteredMessages.length > 0 &&
              filteredMessages.map((data) => (
                <div className="d-flex alert-box align-center">
                  <div>
                    User&nbsp;<strong>{data.requestor.username}</strong>
                    &nbsp;has requested for {data.requestedItems.length} items
                  </div>
                </div>
              ))}
            {filteredAlerts.length > 0 &&
              filteredAlerts.map((data) => (
                <div className="d-flex alert-box align-center">
                  <div>
                    Your recent request was{' '}
                    {data.success ? 'accepted' : 'declined'}.
                  </div>
                </div>
              ))}
            {(filteredMessages.length > 0 || filteredAlerts.length > 0) && (
              <div className="d-flex space-btw">
                <div></div>
                <button onClick={() => setMessages([])}>Clear messages</button>
              </div>
            )}
          </div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {state.currentUser.userId && (
              <>
                <Route path="/all-users" element={<AllUsersPage />} />
                <Route path="/user/:id" element={<SingleUserPage />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/upload" element={<Upload />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </mainContext.Provider>
    </div>
  );
}

export default App;
