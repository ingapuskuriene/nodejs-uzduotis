import { useContext } from 'react';
import mainContext from '../context/mainContext';
import fetchRequest from '../fetchRequest';

import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://localhost:4000');

const Requests = () => {
  const { state, setState } = useContext(mainContext);

  const approveRequest = (request) => {
    const newRequests = state.requests.filter(
      (item) => item._id !== request._id
    );
    fetchRequest('/update-request', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ...request, success: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setState({ ...state, requests: newRequests });
          socket.emit('message', {
            ...request,
            success: true,
            complete: true,
            alert: true,
          });
        } else {
          console.log('error');
        }
      });
  };
  const declineRequest = (request) => {
    const newRequests = state.requests.filter(
      (item) => item._id !== request._id
    );
    fetchRequest('/update-request', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ success: false, _id: request._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setState({ ...state, requests: newRequests });
          socket.emit('message', {
            ...request,
            success: false,
            complete: true,
            alert: true,
          });
        } else {
          console.log('error');
        }
      });
  };

  return (
    <div>
      <h1>Requests</h1>
      <hr />
      <div>
        {state.requests
          .filter(
            (request) =>
              request.owner.id === state.currentUser.userId && !request.complete
          )
          .map((request) => {
            return (
              <div
                className="square mb-10 align-center d-flex space-btw full-width"
                key={request._id}
              >
                <div>
                  <div className="m-10">
                    <h3 className="d-flex items-center">
                      <img
                        src={request.requestor.photo}
                        height="20"
                        alt=""
                        className="mr-10"
                      />
                      <div>{request._id}</div>
                      <br />
                      {request.requestor.username} requested for these items:
                    </h3>
                  </div>
                  <div className="d-flex m-10">
                    {request.requestedItems.map((item) => {
                      return (
                        <div
                          className="square mr-10 align-center d-flex"
                          key={item._id}
                        >
                          <img
                            src={item.photo}
                            height="40"
                            alt=""
                            className="mr-10"
                          />
                          {item.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="d-flex">
                  <button
                    onClick={() => approveRequest(request)}
                    className="mr-10"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => declineRequest(request)}
                    className="mr-10"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Requests;
