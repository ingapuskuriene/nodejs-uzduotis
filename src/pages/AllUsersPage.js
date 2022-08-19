import { useNavigate } from 'react-router-dom';

import { useContext } from 'react';
import mainContext from '../context/mainContext';

const AllUsersPage = () => {
  const navigate = useNavigate();
  const { state } = useContext(mainContext);

  return (
    <div className="d-flex flex-column">
      <h4>All users</h4>
      <div className="d-flex flex-column">
        {state.users &&
          state.users
            .filter((user) => state.currentUser.userId !== user.id)
            .map((user) => (
              <button
                key={user.id}
                onClick={() => navigate(`/user/${user.id}`)}
                className="mb-10"
              >
                <div className="d-flex align-center">
                  <span className="mr-10">+</span>
                  {user.photo && (
                    <img
                      src={user.photo}
                      height={25}
                      alt="Profile"
                      className="mr-10"
                    />
                  )}
                  <h6>{user.username}</h6>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
};

export default AllUsersPage;
