import { state, useContext, useState } from 'react';
import PixelCard from '../components/PixelCard';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContext);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) =>{
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if(state === 'Login'){
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password})

        if(data.success){
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }

      }else{
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password})

        if(data.success){
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
  <section>
    <div className="mt-10 flex items-center justify-center">
      <PixelCard variant="blue">
        <div className="w-full flex flex-col items-center px-6">
          <h1 className=" text-xl font-bold mb-8">{state === 'Login' ? 'Access the Batcave' : 'Initiate Identity Protocol'}</h1>
          <form className="w-full flex flex-col gap-4" onSubmit={onSubmitHandler}>
            {state != 'Login' ?
            <div className="relative w-full">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <img src='icons8-batman.svg' className='w-5 h-5 color-white'/>
            </span>
            <input
            type="text"
            onChange={(e) => setName(e.target.value)} value={name}
            placeholder="Codename"
            className="w-full pl-12 pr-4 py-2 rounded-full border placeholder-gray-400 focus:outline-none focus:ring-1"
            autoComplete="name"
            /></div>
            : null}
            <div className="relative w-full">
  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
    <img src='icons8-bat.svg' className='w-5 h-5 color-white'/>
  </span>
  <input
    type="email"
    onChange={(e) => setEmail(e.target.value)} value={email}
    placeholder="Batmail"
    className="w-full pl-12 pr-4 py-2 rounded-full border placeholder-gray-400 focus:outline-none focus:ring-1"
    autoComplete="email"
    
  /></div>
  <div className="relative w-full">
  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
    <img src='icons8-key.svg' className='w-5 h-5 color-white'/>
  </span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)} value={password}
              placeholder={state === 'Login' ? 'Secret Key' : 'Create Secret Key'}
              className="w-full pl-12 pr-4 py-2 rounded-full border placeholder-gray-400 focus:outline-none focus:ring-1"
              autoComplete="current-password"
              
            /></div>
            {state === 'Login' ?
            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-xs hover:underline"
              >
                Reset Protocols?
              </Link>
            </div>
            : null}
            <button
              type="submit"
              className="w-full py-2 bg-[#00948f] text-white font-semibold rounded-full mt-2 hover:bg-[#01807b] transition cursor-pointer  disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled = {password.length < 6}
            >
              Initiate
            </button>
          </form>
          { state === 'Login' ? 
          <div className="mt-4 text-sm flex gap-2">
            <span className="text-gray-400">Unauthorized?</span>
            <Link onClick={()=> setState('Register')} className="text-blue-500 hover:underline">
            Request access
            </Link>
          </div>
          : 
          <div className="mt-4 text-sm flex gap-2">
            <span className="text-gray-400">Authorized?</span>
            <Link onClick={()=> setState('Login')} className="text-blue-500 hover:underline">
            Enter the Batcave
            </Link>
          </div>}
        </div>
      </PixelCard>
    </div>
  </section>
)};

export default Login;
