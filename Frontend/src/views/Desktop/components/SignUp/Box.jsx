import PasswordIcon from '@mui/icons-material/Password';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '../../../../Context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';

export default function Box() {
  const navigate = useNavigate("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { handleSignUp } = useContext(AuthContext);

  const handleAuth = async () => {
    try{
      let u = username;
      let result = await handleSignUp(name, username, password);
      setUsername("");
      setName("");
      setError("");
      setPassword("");
      navigate("/signin", { state: { username: u , message: result , open: true } });
    }catch(error) {
      setError(error); 
    }
  }

  return (
    <div className="row relative grid place-items-center mb-5">
      <div className="h-100 w-80 rounded-lg p-5 bg-white/30 backdrop-blur-sm">
        <p className="text-6xl text-violet-500 mb-5">Sign Up</p>
        <form className="row g-3 needs-validation" noValidate>
          <div className="input-group position-relative mt-5">
            <span className="input-group-text p-3"><PermIdentityIcon /></span>
            <div className="form-floating is-invalid">
              <input
                type="text"
                className="form-control"
                id="floatingInputGroup2"
                placeholder="Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
              <label for="floatingInputGroup2">Name</label>
            </div>
            <div className="invalid-tooltip">Enter your Name</div>
          </div>
          <div className="input-group position-relative mt-5">
            <span className="input-group-text p-3">@</span>
            <div className="form-floating is-invalid">
              <input
                type="text"
                className="form-control"
                id="floatingInputGroup2"
                placeholder="Username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <label for="floatingInputGroup2">Username</label>
            </div>
            <div className="invalid-tooltip">Enter your username</div>
          </div>
          <div className="input-group position-relative mt-5">
            <span className="input-group-text p-3"><PasswordIcon /></span>
            <div className="form-floating is-invalid">
              <input
                type="Password"
                className="form-control"
                id="floatingInputGroup2"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <label for="floatingInputGroup2">Password</label>
            </div>
            <div className="invalid-tooltip">Make a Strong password</div>
          </div>
          <p style={{color: "red"}} className='pt-5'>{error}</p>
          <button
            className="bg-violet-500 text-white col-3 mt-5 p-2 rounded-3 fs-5"
            type="button"
            onClick={handleAuth}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
