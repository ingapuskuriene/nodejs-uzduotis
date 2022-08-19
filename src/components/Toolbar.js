import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import mainContext from '../context/mainContext';

const Toolbar = () => {
  const { state, setState } = useContext(mainContext);
  const navigate = useNavigate();
  const { currentUser } = state;

  const requests = state.requests;
  function logout() {
    setState({ ...state, currentUser: {} });
    navigate('/');
  }

  return (
    <div className="toolbar d-flex space-btw">
      {currentUser.userId && (
        <div className="d-flex align-center">
          <img
            alt="avatar"
            src={currentUser.photo}
            height={30}
            className="mr-10"
          />
          <h3>{currentUser.username}</h3>
        </div>
      )}

      {!currentUser.userId ? (
        <div>
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      ) : (
        <div>
          <Link to="/upload">Upload</Link>
          <Link to={`/user/${currentUser.userId}`}>My Items</Link>
          <Link to="/all-users">All users</Link>
          <Link to="/requests">
            Requests{' '}
            {requests && (
              <strong>
                (
                {
                  requests.filter(
                    (request) =>
                      request.owner.id === currentUser.userId &&
                      !request.complete
                  ).length
                }
                )
              </strong>
            )}
          </Link>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
