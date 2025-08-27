import React, {useContext, useEffect, useState} from 'react';
import PixelCard from '../components/PixelCard';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedin, userData, getUserData} = React.useContext(AppContext);

  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length -1){
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && index > 0 && e.target.value === ''){
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
        if(index < inputRefs.current.length - 1){
          inputRefs.current[index + 1].focus();
        }
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');

      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp})

      if(data.success){
        toast.success(data.message);
        getUserData()
        navigate('/');
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() =>{
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const ResendVerificationOtp = async()=>{
    if (countdown > 0) return; // extra guard
    setCountdown(30);
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if(data.success) {
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedin, userData]);

  return (
    <div className="mt-10 mb-2 flex items-center justify-center">
    <PixelCard variant='blue' className="landscape-card">
      <form onSubmit={onSubmitHandler}>
  <div className="w-full h-full flex flex-col justify-start items-center px-8 py-6">
    <h1 className="text-xl font-bold mb-2">Enter Access Key</h1>
    <p className="text-sm mb-6">Enter the 6-digit access key received via Batmail</p>
    <div className="flex gap-3 my-2" onPaste={handlePaste}>
      {Array(6).fill(0).map((_, index) =>(
        <input
          key={index}
          type="text"
          maxLength="1"
          className="w-10 h-10 text-center text-lg border border-gray-400 rounded-full focus:outline-none focus:ring-1 "
          autoFocus={index === 0}
          ref={e => inputRefs.current[index] = e}
          onInput={(e)=> handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>

    <div className="mt-4 text-sm flex justify-end w-full">
    {countdown > 0 ? (
        <span className="cursor-not-allowed">
          Resend Key ({countdown})
        </span>
      ) : (
        <Link
          onClick={ResendVerificationOtp}
          className="hover:underline"
        >
          Resend Key
        </Link>
      
    )}
    </div>
    <button
      type="submit"
      className="w-full py-2 bg-[#00948f] text-white font-semibold rounded-full mt-7 hover:bg-[#01807b] transition cursor-pointer"
    >
      Initiate
    </button>
  </div>
  </form>
</PixelCard>

    </div>
  )
}

export default EmailVerify