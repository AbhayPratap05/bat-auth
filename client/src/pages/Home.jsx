import React, { useContext } from 'react';
import AnimatedContent from '../components/AnimatedContent';
import DecryptedText from '../components/DecryptedText';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const {userData} = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section className='sm:mx-0 mx-10 pb-30 sm:pb-0'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="/hero.png"
          alt="heroimg"
          style={{ maxWidth: '250px', width: '100%', height: 'auto' }}
        />
      </div>
      <div class="flex flex-col items-center justify-center text-center">
        <h1 className=" force-neon text-2xl md:text-3xl font-semibold text-center mt-2">Welcome{userData ? ", "+userData.name : ' to Gotham’s Last Hope'} </h1>

<DecryptedText
  text="In a city that never sleeps, the darkness calls for a hero. Suit up, dive deep, and become part of the legend."
  animateOn="view"
  revealDirection="center"
  class="text-base md:text-lg mt-2 max-w-xl"
/>
  </div>
      {/* Center the button/animated content below */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
        <AnimatedContent
          distance={40}
          direction="verticle"
          reverse={false}
          duration={0.6}
          ease="bounce.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.2}
        >
          <div onClick={() => navigate('/dashboard')} className="px-6 py-2 border-1 border-[#00fff7] rounded-md font-semibold hover:bg-cyan-600 cursor-pointer transition-all duration-300">
            Enter The Shadows
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
};

export default Home;
