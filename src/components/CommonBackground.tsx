import './CommonBackground.scss';

export default function CommonBackground() {
  return (
    <div className='background'>
        {/* <img src='/img/backgroundImage.jpg' alt='Imagem de Background' className='background-image' /> */}
        <video className="background-image" autoPlay muted loop playsInline> <source src="/video/backgroundVideo.webm" type="video/webm" /> </video>
    </div>
  );
}