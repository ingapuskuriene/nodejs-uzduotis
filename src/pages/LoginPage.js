import { useRef, useState, useContext } from 'react';
import fetchRequest from '../fetchRequest';
import { useNavigate } from 'react-router-dom';

import mainContext from '../context/mainContext';

const LoginPage = () => {
  const { state, setState } = useContext(mainContext);

  const emailRef = useRef();
  const passRef = useRef();

  const navigate = useNavigate();

  const [error, setError] = useState(null);

  function loginUser() {
    const user = {
      username: emailRef.current.value,
      password: passRef.current.value,
    };

    fetchRequest('/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setState({ ...state, currentUser: data });
          navigate('/requests');
        } else {
          return setError(data.error);
        }
      });
  }

  return (
    <div className="d-flex flex-column">
      {error && <h3 className="text-red">{error}</h3>}
      <input ref={emailRef} type="text" placeholder="username" />
      <input ref={passRef} type="password" placeholder="password" />
      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default LoginPage;
