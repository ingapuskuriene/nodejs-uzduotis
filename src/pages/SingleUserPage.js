import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import mainContext from '../context/mainContext';
import fetchRequest from '../fetchRequest';

import socketIOClient from 'socket.io-client';

const SingleUserPage = () => {
  const socket = socketIOClient('http://localhost:4000');
  const { state } = useContext(mainContext);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [requestedItems, setRequestedItems] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetchRequest('/user-items', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userId: id }),
    })
      .then((res) => res.json())
      .then((res) => {
        setItems(res.items);
      });
  }, [id]);

  const [user] = state.users.filter((user) => user.id === id);

  const isMyItemsPage = id === state.currentUser.userId;

  const addItemToRequest = (item) => {
    const alreadyRequested = requestedItems.find((it) => it._id === item._id);

    if (alreadyRequested) {
      const filteredItems = requestedItems.filter((it) => it._id !== item._id);
      setRequestedItems(filteredItems);
    } else {
      setRequestedItems([...requestedItems, item]);
    }
  };

  const makeRequest = () => {
    fetchRequest('/create-request', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        requestedItems,
        requestor: state.currentUser,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          socket.emit('message', {
            success: true,
            owner: user,
            ...res.data,
          });
          setRequestedItems([]);
          setMessage('Request sent');
        } else {
          alert('There was an error with socket.io!');
        }
      });
  };

  return (
    <div>
      {message && (
        <div className="full-width p-10 items-list mb-10">
          <strong>{message}</strong>
        </div>
      )}
      {isMyItemsPage ? (
        <h1>My Items</h1>
      ) : (
        <div className="d-flex align-center mb-10">
          <img src={user.photo} width="100" alt="" className="mr-10" />
          <h1>{user.username}</h1>
          <div>{id}</div>
        </div>
      )}
      <hr className="mb-10" />
      <div className="d-flex mr-10 space-btw">
        <div className="d-flex align-center">
          {items.map((item) => {
            const itemRequested = requestedItems.find(
              (it) => it._id === item._id
            );
            return (
              <div className="square mr-10" key={item._id}>
                <img src={item.photo} height="150" alt="" className="mb-10" />
                <h5>{item.title}</h5>
                {!isMyItemsPage && (
                  <button
                    onClick={() => addItemToRequest(item)}
                    className="full-width"
                  >
                    {itemRequested ? '-' : '+'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {!isMyItemsPage && (
          <div className="items-list p-10">
            <h3 className="mb-10">Requested Items</h3>
            <div className="d-flex flex-column mb-10">
              {requestedItems.map((item) => {
                return (
                  <div
                    className="square mb-10 align-center d-flex"
                    key={item._id}
                  >
                    <img
                      src={item.photo}
                      height="20"
                      alt=""
                      className="mr-10"
                    />
                    {item.title}
                  </div>
                );
              })}
            </div>
            {requestedItems.length > 0 && (
              <button onClick={makeRequest} className="full-width">
                Request
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUserPage;
