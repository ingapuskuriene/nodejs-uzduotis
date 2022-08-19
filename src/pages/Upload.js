import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchRequest from '../fetchRequest';

import mainContext from '../context/mainContext';

const AllUsersPage = () => {
  const navigate = useNavigate();
  const { state, setState } = useContext(mainContext);
  const [error, setError] = useState(null);

  async function uploadItem() {
    let invalid = false;
    if (photoRef.current.value === '') {
      invalid = 'Item needs a photo';
    }
    if (titleRef.current.value === '') {
      invalid = 'Item needs a title';
    }
    if (invalid) {
      return setError(invalid);
    }

    fetchRequest('/upload-item', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        owner: state.currentUser.userId,
        title: titleRef.current.value,
        photo: photoRef.current.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setState({ ...state, myItems: [...state.myItems, res.item] });
          navigate(`/user/${state.currentUser.userId}`);
        } else {
          setError('Something went wrong. Item not added.');
        }
      });
  }
  const titleRef = useRef();
  const photoRef = useRef();

  return (
    <div className="d-flex flex-column">
      {error && <h3 className="text-red">{error}</h3>}
      <p>Item title</p>
      <input ref={titleRef} type="text" placeholder="Item title" />
      <p>Item photo URL</p>
      <input ref={photoRef} type="text" placeholder="photo URL" />
      <button onClick={uploadItem}>Upload</button>
    </div>
  );
};

export default AllUsersPage;
