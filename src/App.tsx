import { useState } from 'react';
import './app.css';
import axios from 'axios';

function App() {
    const [userLink, setUserLink] = useState('');
    const [shortenedLink, setShortenedLink] = useState('');
    const [QRcode, setQRcode] = useState('');

    const handleUserEnterLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserLink(event.target.value);
    };

    const sendOrderToBackend = async (link: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/short', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ origUrl: link }), // Send as an object
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const responseData = await response.json();
            setShortenedLink(responseData.shortUrl);
            console.log('Link successfully submitted:', responseData);
        } catch (error) {
            console.error('Error submitting Link:', error);
        }
    };

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (userLink.trim() === '') {
            console.error('User link is empty');
            return;
        }
        sendOrderToBackend(userLink);
    };

    const handleQRcodeGenerate = async () => {
        const response = await fetch('http://localhost:5000/generate/qrcode', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: shortenedLink }),
          });
      
          const data = await response.json();
          setQRcode(data.qrCode);
          console.log(data)
          console.log(data.qrCode)
    };

    return (
        <div className="d-flex flex-column align-items-center">
          <h1 className='m-5'>URL Shortener</h1>
          <form className='d-flex text-center flex-column input-group-prepend'>
            <input type='text' className='form-control' style={{width:'500px'}} onChange={handleUserEnterLink} value={userLink} />
          <button type='submit' className='m-auto my-5 btn btn-primary btn-lg' onClick={handleSubmit}>Shorten URL and Copy to Clipboard</button>
          </form>
          <input type='text' value={shortenedLink} className='form-control' style={{width:'500px'}} readOnly />
          <button type='button' className='m-auto my-5 btn btn-secondary btn-lg' onClick={handleQRcodeGenerate}>Generate QR code</button>
          {QRcode && <img src={`data:image/svg+xml;base64,${QRcode}`} alt="QR Code" />}
        </div>
    );
}

export default App;
