import React, {useContext, useEffect, useState } from 'react';
import Stepper, { Step } from '../components/Stepper';
import PixelCard from '../components/PixelCard';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ResetPassword = () => {

  const {backendUrl} = React.useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [isEmailSent, setisEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setisOtpSubmitted] = useState(false);

  const [countdown, setCountdown] = useState(0);

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

  const onSubmitEmail =  async(e)=>{
    e?.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});

      data.success ? toast.success(data.message) : toast.error(data.message);
      if(data.success){
        setisEmailSent(true);
        setStep(3);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const getOtpValue = () => inputRefs.current.map((ref) => ref?.value || '').join('');

  const onSubmitOtp = async(e)=>{
    e.preventDefault();
    const enteredOtp = getOtpValue();
    const {data} = await axios.post(backendUrl + '/api/auth/verify-reset-otp', {email, otp: enteredOtp})

      if(data.success){
        toast.success(data.message);
        setisOtpSubmitted(true);
        setOtp(enteredOtp);
        setStep(4);
      }else{
        toast.error(data.message);
      }
  }

  const onSubmitNewPass = async (e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
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

  const handleResend = () => {
    onSubmitEmail();
    setCountdown(30); // disable for 30 seconds
  };


  const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const isEmailStepValid = step !== 2 || (email && isValidEmail(email));
  const isPasswordStepValid = step !== 3 || newPassword.length >= 6;

  const disableNext =
    (step === 2 && !isEmailStepValid) || (step === 3 && !isPasswordStepValid);

  return (
    <div className="w-full flex justify-center pt-8">
      <PixelCard className='stepper' variant="blue">
      <Stepper currentStep = {step} initialStep={step} onStepChange={(s) => setStep(s)} disableStepIndicators>
        <Step>
          <>
          <h2>Reset Protocols</h2>
          <p className="text-sm mt-2">You have entered the protocol reset process</p>
          {step === 1 && (
          <button
                type="button"
                onClick={() => setStep(2)}
                className="my-6 w-full py-2 rounded-full bg-[#00948f] text-white font-semibold hover:bg-[#01807b] transition cursor-pointer"
              >
                Next
              </button>
          )}
              </>
        </Step>

        <Step>
        <>
          <h2>Enter your batmail</h2>
          <div className="relative w-full mt-5">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <img src='icons8-bat.svg' className='w-5 h-5 color-white'/>
          </span>
            <input
              type="email"
              placeholder="Batmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 py-2 rounded-full border placeholder-gray-400 focus:outline-none focus:ring-1"
              autoComplete="email"
              />
          </div>
          {step === 2 && (
          <button
                type="button"
                disabled={!isValidEmail(email)}
                onClick={onSubmitEmail}
                className="my-6 w-full py-2 rounded-full font-semibold text-white transition disabled:bg-gray-400 bg-[#00948f] hover:bg-[#01807b]  cursor-pointer"
              >
                Next
              </button>
          )}
          </>
        </Step>

        <Step>
          <>
          <h2>Enter the Access Key</h2>
          <p className="text-sm mt-2">Enter the 6-digit access key recieved via Batmail</p>
          <div className="flex justify-center gap-3 my-2 sm:gap-3 gap-2" onPaste={handlePaste}>
      {Array(6).fill(0).map((_, index) =>(
        <input
          key={index}
          type="text"
          maxLength="1"
          className="mt-5 text-center text-lg border border-gray-400 rounded-full focus:outline-none focus:ring-1 w-10 h-10 sm:w-10 sm:h-10 w-8 h-8"
          autoFocus={index === 0}
          ref={e => inputRefs.current[index] = e}
          onInput={(e)=> handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
    <div className="mt-5 text-sm flex justify-end">
      {countdown > 0 ? (
        <span className="cursor-not-allowed">
          Resend Key ({countdown})
        </span>
      ) : (
        <button
          onClick={handleResend}
          className="hover:underline"
        >
          Resend Key
        </button>
      )}
    </div>
    {step === 3 && (
    <button
                type="button"
                onClick={onSubmitOtp}
                className="my-6 mb-8 w-full py-2 justify-center rounded-full font-semibold text-white transition disabled:bg-gray-400 bg-[#00948f] hover:bg-[#01807b] cursor-pointer"
              >
                Submit
              </button>
    )}
          </>
        </Step>

        <Step>
          <>
          <h2>Final Step</h2>
          <div className="relative w-full mt-5">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <img src="icons8-key.svg" className="w-5 h-5" />
            </span>
            <input
              type="password"
              placeholder="Create New Secret Key"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              className="w-full pl-12 py-2 rounded-full border placeholder-gray-400 focus:outline-none focus:ring-1"
              autoComplete="current-password"
              />
          </div>
          {step === 4 && (
          <button
                type="button"
                disabled={newPassword.length < 6}
                onClick={onSubmitNewPass}
                className="my-6 w-full py-2 rounded-full font-semibold text-white transition disabled:bg-gray-400 bg-[#00948f] hover:bg-[#01807b] cursor-pointer"
              >
                Confirm
              </button>
          )}
          </>
        </Step>
      </Stepper>
      </PixelCard>
    </div>
  );
};

export default ResetPassword;
