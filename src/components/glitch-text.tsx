import type React from "react"

interface GlitchTextProps {
  text: string
  className?: string
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => {
  return (
    <div className={`glitch ${className}`} data-text={text}>
      {text}
      <style jsx>{`
        .glitch {
          position: relative;
          color: #22c55e;
          font-weight: bold;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        .glitch::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9;
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% {
            clip: rect(17px, 9999px, 94px, 0);
          }
          5% {
            clip: rect(33px, 9999px, 145px, 0);
          }
          10% {
            clip: rect(121px, 9999px, 11px, 0);
          }
          15% {
            clip: rect(144px, 9999px, 75px, 0);
          }
          20% {
            clip: rect(20px, 9999px, 78px, 0);
          }
          25% {
            clip: rect(75px, 9999px, 5px, 0);
          }
          30% {
            clip: rect(137px, 9999px, 147px, 0);
          }
          35% {
            clip: rect(63px, 9999px, 60px, 0);
          }
          40% {
            clip: rect(23px, 9999px, 86px, 0);
          }
          45% {
            clip: rect(57px, 9999px, 30px, 0);
          }
          50% {
            clip: rect(30px, 9999px, 131px, 0);
          }
          55% {
            clip: rect(67px, 9999px, 128px, 0);
          }
          60% {
            clip: rect(64px, 9999px, 34px, 0);
          }
          65% {
            clip: rect(127px, 9999px, 120px, 0);
          }
          70% {
            clip: rect(15px, 9999px, 53px, 0);
          }
          75% {
            clip: rect(12px, 9999px, 57px, 0);
          }
          80% {
            clip: rect(127px, 9999px, 48px, 0);
          }
          85% {
            clip: rect(1px, 9999px, 69px, 0);
          }
          90% {
            clip: rect(41px, 9999px, 70px, 0);
          }
          95% {
            clip: rect(105px, 9999px, 85px, 0);
          }
          100% {
            clip: rect(116px, 9999px, 33px, 0);
          }
        }
        @keyframes glitch-anim-2 {
          0% {
            clip: rect(129px, 9999px, 36px, 0);
          }
          5% {
            clip: rect(36px, 9999px, 4px, 0);
          }
          10% {
            clip: rect(85px, 9999px, 66px, 0);
          }
          15% {
            clip: rect(91px, 9999px, 91px, 0);
          }
          20% {
            clip: rect(148px, 9999px, 138px, 0);
          }
          25% {
            clip: rect(38px, 9999px, 122px, 0);
          }
          30% {
            clip: rect(69px, 9999px, 54px, 0);
          }
          35% {
            clip: rect(98px, 9999px, 71px, 0);
          }
          40% {
            clip: rect(146px, 9999px, 34px, 0);
          }
          45% {
            clip: rect(134px, 9999px, 43px, 0);
          }
          50% {
            clip: rect(102px, 9999px, 80px, 0);
          }
          55% {
            clip: rect(119px, 9999px, 44px, 0);
          }
          60% {
            clip: rect(106px, 9999px, 99px, 0);
          }
          65% {
            clip: rect(141px, 9999px, 74px, 0);
          }
          70% {
            clip: rect(20px, 9999px, 78px, 0);
          }
          75% {
            clip: rect(133px, 9999px, 79px, 0);
          }
          80% {
            clip: rect(78px, 9999px, 52px, 0);
          }
          85% {
            clip: rect(35px, 9999px, 39px, 0);
          }
          90% {
            clip: rect(67px, 9999px, 70px, 0);
          }
          95% {
            clip: rect(71px, 9999px, 103px, 0);
          }
          100% {
            clip: rect(83px, 9999px, 40px, 0);
          }
        }
      `}</style>
    </div>
  )
}

export default GlitchText

