import { useRef, useState } from 'react';
import fetchRequest from '../fetchRequest';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const emailRef = useRef(null);
  const passOneRef = useRef(null);
  const passTwoRef = useRef(null);
  const photoRef = useRef(null);

  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const validateUsername = (username) => {
    return String(username).match(/(.*[A-Z].*)/);
  };

  const validPasswordFormat = (password) => {
    return String(password).match(
      /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*_+]).{4,20}$/
    );
  };

  const validUrlFormat = (url) => {
    return String(url).match(/^(http|https):\/\/[^ "]+$/);
  };

  function registerUser() {
    let invalid = false;

    const user = {
      email: emailRef.current.value,
      passOne: passOneRef.current.value,
      passTwo: passTwoRef.current.value,
      photo: photoRef.current.value,
    };

    if (!validateUsername(user.email)) invalid = 'Incorrect user name format';
    if (!validPasswordFormat(user.passOne))
      invalid = 'Incorrect password format';
    if (user.passOne !== user.passTwo) invalid = 'Passwords do not match';
    if (!validUrlFormat(user.photo)) invalid = 'Incorrect photo URL';
    if (invalid) return setError(invalid);

    fetchRequest('/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: user.email,
        passOne: user.passOne,
        passTwo: user.passTwo,
        photo: user.photo,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate('/');
        } else {
          setError(data.error);
        }
      });
  }

  return (
    <div className="d-flex flex-column">
      {error && <h3 className="text-red">{error}</h3>}
      <p>Username:</p>
      <input ref={emailRef} type="text" placeholder="Username" />
      <p>Password:</p>
      <input ref={passOneRef} type="password" placeholder="Password" />
      <input ref={passTwoRef} type="password" placeholder="Repeat password" />
      <p>Photo URL:</p>
      <input ref={photoRef} type="text" placeholder="URL" />
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default RegisterPage;
